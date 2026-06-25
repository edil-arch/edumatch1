package main

import (
	"edumatch-edil-backend/config"
	"edumatch-edil-backend/database"
	"edumatch-edil-backend/routes"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()
	database.ConnectDB()
	database.MigrateDB()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "EduMatch Edil API works"})
	})

	routes.SetupRoutes(r)

	port := config.GetEnv("PORT", "8080")
	log.Println("Server started on port " + port)
	r.Run(":" + port)
}
