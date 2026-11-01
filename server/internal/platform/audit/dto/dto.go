package dto

type Item struct {
	ID      string `json:"id"`
	Action  string `json:"action"`
	Actor   string `json:"actor"`
	Summary string `json:"summary"`
}
