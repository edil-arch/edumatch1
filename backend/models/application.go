package models

import "time"

type Application struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	ProjectID uint      `json:"project_id"`
	Status    string    `json:"status" gorm:"default:'pending'"`
	User      User      `json:"user"`
	Project   Project   `json:"project"`
	CreatedAt time.Time `json:"created_at"`
}
