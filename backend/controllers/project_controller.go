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

	c.JSON(http.StatusOK, project)
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
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var input models.Project
	c.ShouldBindJSON(&input)

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
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	database.DB.Delete(&project)

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted"})
}

func MyProjects(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var projects []models.Project

	database.DB.Where("creator_id = ?", userID).Find(&projects)

	c.JSON(http.StatusOK, projects)
}

func RecommendedProjects(c *gin.Context) {
	var projects []models.Project

	database.DB.Order("created_at DESC").Limit(10).Find(&projects)

	c.JSON(http.StatusOK, projects)
}
