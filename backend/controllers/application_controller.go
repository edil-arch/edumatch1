package controllers

import (
	"edumatch-edil-backend/database"
	"edumatch-edil-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func JoinProject(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	projectID := c.Param("id")

	var existing models.Application
	if err := database.DB.Where("user_id = ? AND project_id = ?", userID, projectID).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Already applied"})
		return
	}

	application := models.Application{
		UserID:    userID,
		ProjectID: parseUint(projectID),
		Status:    "pending",
	}

	database.DB.Create(&application)
	c.JSON(http.StatusCreated, application)
}

func MyApplications(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var applications []models.Application
	database.DB.Preload("Project").Where("user_id = ?", userID).Find(&applications)

	c.JSON(http.StatusOK, applications)
}

func ProjectApplications(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	projectID := c.Param("id")

	var project models.Project
	if err := database.DB.First(&project, projectID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	if project.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only creator can see applications"})
		return
	}

	var applications []models.Application
	database.DB.Preload("User").Where("project_id = ?", projectID).Find(&applications)

	c.JSON(http.StatusOK, applications)
}

func UpdateApplicationStatus(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var application models.Application
	if err := database.DB.Preload("Project").First(&application, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Application not found"})
		return
	}

	if application.Project.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only creator can update application"})
		return
	}

	var input struct {
		Status string `json:"status"`
	}

	c.ShouldBindJSON(&input)

	if input.Status != "accepted" && input.Status != "rejected" && input.Status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
		return
	}

	application.Status = input.Status
	database.DB.Save(&application)

	c.JSON(http.StatusOK, application)
}
