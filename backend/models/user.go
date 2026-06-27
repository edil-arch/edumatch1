package models

import "time"

type User struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	Name       string    `json:"name"`
	Nickname   string    `json:"nickname" gorm:"unique"`
	Email      string    `json:"email" gorm:"unique;not null"`
	Password   string    `json:"-"`
	University string    `json:"university"`
	Course     int       `json:"course"`
	About      string    `json:"about"`
	Skills     string    `json:"skills"`
	Avatar     string    `json:"avatar"`
	Rating     int       `json:"rating" gorm:"default:0"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
