package statemachine

import "encoding/xml"

type UMLElementType string

const (
	UMLSpecialState UMLElementType = "UMLSpecialState"
	UMLState        UMLElementType = "UMLState"
	Relation        UMLElementType = "Relation"
)

func Convert(uxfStr string) (StateMachine, error) {
	var diagram Diagram

	if err := xml.Unmarshal([]byte(uxfStr), &diagram); err != nil {
		return StateMachine{}, err
	}

	stateMachine := StateMachine{
		States: make(map[string][]string),
		Trans:  make(map[string]Transition),
		Combos: make(map[string]Combo),
		Exprs:  make(map[string]Expr),
	}

	// UXF -> StateMachine conversion

	return stateMachine, nil
}
