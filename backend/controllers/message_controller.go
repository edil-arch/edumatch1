package controllers

import (
	"edumatch-edil-backend/database"
	"edumatch-edil-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProjectMessages(c *gin.Context) {
	projectID := c.Param("id")

	var messages []models.Message

	database.DB.
		Preload("User").
		Where("project_id = ?", projectID).
		Order("created_at ASC").
		Find(&messages)

	c.JSON(http.StatusOK, messages)
}

func CreateMessage(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	projectID := parseUint(c.Param("id"))

	var input struct {
		Text string `json:"text"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}

	message := models.Message{
		ProjectID: projectID,
		UserID:    userID,
		Text:      input.Text,
	}

	database.DB.Create(&message)

	database.DB.Preload("User").First(&message, message.ID)

	c.JSON(http.StatusCreated, message)
}
