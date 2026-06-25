package models

import "time"

type Project struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Stack       string    `json:"stack"`
	Deadline    string    `json:"deadline"`
	CreatorID   uint      `json:"creator_id"`
	Creator     User      `json:"creator" gorm:"foreignKey:CreatorID"`
	CreatedAt   time.Time `json:"created_at"`
}
