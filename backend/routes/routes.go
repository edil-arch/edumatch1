package routes

import (
	"edumatch-edil-backend/controllers"
	"edumatch-edil-backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")

	api.POST("/auth/register", controllers.Register)
	api.POST("/auth/login", controllers.Login)

	api.GET("/projects", controllers.GetProjects)
	api.GET("/projects/:id", controllers.GetProjectByID)

	api.GET("/users", controllers.GetUsers)
	api.GET("/users/:id", controllers.GetUserByID)

	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())

	protected.GET("/auth/me", controllers.Me)
	protected.PUT("/profile", controllers.UpdateProfile)

	protected.POST("/projects", controllers.CreateProject)
	protected.PUT("/projects/:id", controllers.UpdateProject)
	protected.DELETE("/projects/:id", controllers.DeleteProject)

	protected.POST("/projects/:id/join", controllers.JoinProject)
	protected.GET("/my-projects", controllers.MyProjects)
	protected.GET("/my-applications", controllers.MyApplications)
	protected.GET("/recommended-projects", controllers.RecommendedProjects)

	protected.GET("/projects/:id/applications", controllers.ProjectApplications)
	protected.PUT("/applications/:id/status", controllers.UpdateApplicationStatus)

	protected.GET("/projects/:id/messages", controllers.GetProjectMessages)
	protected.POST("/projects/:id/messages", controllers.CreateMessage)
}
