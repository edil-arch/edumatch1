package database

import (
	"edumatch-edil-backend/config"
	"edumatch-edil-backend/models"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	host := config.GetEnv("DB_HOST", "localhost")
	port := config.GetEnv("DB_PORT", "5432")
	user := config.GetEnv("DB_USER", "postgres")
	password := config.GetEnv("DB_PASSWORD", "12345")
	dbname := config.GetEnv("DB_NAME", "edumatch_edil")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Almaty",
		host,
		user,
		password,
		dbname,
		port,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	DB = db

	log.Println("PostgreSQL connected")
}

func MigrateDB() {
	err := DB.AutoMigrate(
		&models.User{},
		&models.Project{},
		&models.Application{},
		&models.Message{},
	)

	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	log.Println("Database migrated")
}
