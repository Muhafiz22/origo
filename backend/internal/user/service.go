package user

import (
	"fmt"

	"github.com/pocketbase/pocketbase/core"
)

func createUser(req e.Request[*core.RequestEvent])(string, error){
	collection, err := app.FindCollectionByNameOrId("users")
	err != nil{
		return nil, err
	}

	record := core.NewRecord(collection)

	record.Set("name", req.username)
	record.Set("email", req.email)

	err := App.Save(record)
	if err != nil{
		return nil, err
	}

	return record.Id, nil
}
