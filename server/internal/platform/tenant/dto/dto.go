package dto

type Item struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

type CreateRequest struct {
	Name   string `json:"name" binding:"required"`
	Status string `json:"status"`
}

type UpdateRequest struct {
	Name   string `json:"name" binding:"required"`
	Status string `json:"status" binding:"required"`
}
