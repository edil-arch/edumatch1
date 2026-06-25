package utils

import (
	"edumatch-edil-backend/config"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(userID uint) (string, error) {
	secret := []byte(config.GetEnv("JWT_SECRET", "secret"))

	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(72 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret)
}

func ParseJWT(tokenString string) (uint, error) {
	secret := []byte(config.GetEnv("JWT_SECRET", "secret"))

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})

	if err != nil {
		return 0, err
	}

	if !token.Valid {
		return 0, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, errors.New("invalid claims")
	}

	userID, ok := claims["user_id"].(float64)
	if !ok {
		return 0, errors.New("invalid user id")
	}

	return uint(userID), nil
}
