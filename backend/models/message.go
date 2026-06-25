package models

import "time"

type Message struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	ProjectID uint      `json:"project_id"`
	UserID    uint      `json:"user_id"`
	Text      string    `json:"text"`
	User      User      `json:"user"`
	CreatedAt time.Time `json:"created_at"`
}
