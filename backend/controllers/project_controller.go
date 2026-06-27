package controllers

import (
	"edumatch-edil-backend/database"
	"edumatch-edil-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProjects(c *gin.Context) {
	var projects []models.Project

	search := c.Query("search")
	stack := c.Query("stack")

	query := database.DB.Preload("Creator")

	if search != "" {
		query = query.Where(
			"title ILIKE ? OR description ILIKE ?",
			"%"+search+"%",
			"%"+search+"%",
		)
	}

	if stack != "" {
		query = query.Where("stack ILIKE ?", "%"+stack+"%")
	}

	query.Order("created_at DESC").Find(&projects)

	c.JSON(http.StatusOK, projects)
}

func GetProjectByID(c *gin.Context) {
	var project models.Project

	if err := database.DB.Preload("Creator").First(&project, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	var members []models.Application
	database.DB.
		Preload("User").
		Where("project_id = ? AND status = ?", project.ID, "accepted").
		Find(&members)

	c.JSON(http.StatusOK, gin.H{
		"project": project,
		"members": members,
	})
}

func CreateProject(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var input models.Project

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}

	project := models.Project{
		Title:       input.Title,
		Description: input.Description,
		Stack:       input.Stack,
		Deadline:    input.Deadline,
		CreatorID:   userID,
	}

	database.DB.Create(&project)

	c.JSON(http.StatusCreated, project)
}

func UpdateProject(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var project models.Project

	if err := database.DB.First(&project, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	if project.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only creator can edit project"})
		return
	}

	var input models.Project

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}

	project.Title = input.Title
	project.Description = input.Description
	project.Stack = input.Stack
	project.Deadline = input.Deadline

	database.DB.Save(&project)

	c.JSON(http.StatusOK, project)
}

func DeleteProject(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var project models.Project

	if err := database.DB.First(&project, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	if project.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only creator can delete project"})
		return
	}

	database.DB.Where("project_id = ?", project.ID).Delete(&models.Application{})
	database.DB.Where("project_id = ?", project.ID).Delete(&models.Message{})
	database.DB.Delete(&project)

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted"})
}

func MyProjects(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var created []models.Project
	var joined []models.Application

	database.DB.Preload("Creator").Where("creator_id = ?", userID).Find(&created)
	database.DB.Preload("Project").Where("user_id = ? AND status = ?", userID, "accepted").Find(&joined)

	c.JSON(http.StatusOK, gin.H{
		"created": created,
		"joined":  joined,
	})
}

func RecommendedProjects(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var user models.User
	database.DB.First(&user, userID)

	var projects []models.Project

	if user.Skills != "" {
		database.DB.
			Preload("Creator").
			Where("stack ILIKE ?", "%"+user.Skills+"%").
			Where("creator_id <> ?", userID).
			Order("created_at DESC").
			Limit(10).
			Find(&projects)
	} else {
		database.DB.
			Preload("Creator").
			Where("creator_id <> ?", userID).
			Order("created_at DESC").
			Limit(10).
			Find(&projects)
	}

	c.JSON(http.StatusOK, projects)
}
