package controllers

import "strconv"

func parseUint(value string) uint {
	id, _ := strconv.Atoi(value)
	return uint(id)
}
