package controllers

import (
	"edumatch-edil-backend/database"
	"edumatch-edil-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUsers(c *gin.Context) {
	var users []models.User

	search := c.Query("search")
	skill := c.Query("skill")

	query := database.DB.Model(&models.User{})

	if search != "" {
		query = query.Where(
			"name ILIKE ? OR university ILIKE ?",
			"%"+search+"%",
			"%"+search+"%",
		)
	}

	if skill != "" {
		query = query.Where("skills ILIKE ?", "%"+skill+"%")
	}

	query.Order("rating DESC").Find(&users)

	c.JSON(http.StatusOK, users)
}

func GetUserByID(c *gin.Context) {
	var user models.User

	if err := database.DB.First(&user, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func UpdateProfile(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var user models.User

	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var input models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}

	user.Name = input.Name
	user.University = input.University
	user.Course = input.Course
	user.About = input.About
	user.Skills = input.Skills
	user.Avatar = input.Avatar

	database.DB.Save(&user)

	c.JSON(http.StatusOK, user)
}
