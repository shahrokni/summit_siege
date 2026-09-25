package statemachine

import "encoding/xml"

type ConvertStateMachineRequest struct {
	UXF string `json:"uxf"`
}

type ConvertStateMachineResponse struct {
	StateMachine StateMachine `json:"state_machine"`
}

type Transition struct {
	Comb string `json:"comb"`
	Next string `json:"next"`
}

type Combo struct {
	Exprs []string `json:"exprs"`
	Oprs  []string `json:"oprs"`
}

type Expr struct {
	Opr   string   `json:"opr"`
	Facts []string `json:"facts"`
}

type StateMachine struct {
	States       map[string][]string   `json:"states"`
	InitialState string                `json:"initial_state"`
	Trans        map[string]Transition `json:"trans"`
	Combos       map[string]Combo      `json:"combos"`
	Exprs        map[string]Expr       `json:"exprs"`
}

type Element struct {
	ID              string `xml:"id"`
	PanelAttributes string `xml:"panel_attributes"`
}

type Diagram struct {
	XMLName  xml.Name  `xml:"diagram"`
	Elements []Element `xml:"element"`
}
