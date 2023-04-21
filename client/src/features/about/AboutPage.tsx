import { Alert, AlertTitle, Button, ButtonGroup, Container, ListItem, ListItemText, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";
import { error } from "console";
import { List } from "@mui/icons-material";
import ServerError from "../../app/errors/ServerError";
import { useNavigate } from "react-router-dom";


export default function AboutPage(){

    const [validationErrors, setValidationErrors] = useState<string[]>([])
    
    const navigate = useNavigate()


    function getValidationError(){
      agent.TestErrors.getValidationError()
      .then(()=> console.log('should not see this'))
      .catch(error => setValidationErrors(error))
    }

    return(
        <>
        <Container>
          <Typography gutterBottom variant="h4">Errors for testing purposes</Typography>
            <ButtonGroup fullWidth>
              <Button variant="contained" onClick={()=> agent.TestErrors.get400Error().catch(error=>console.log(error))}>get 400 Error
              </Button>
              <Button variant="contained" onClick={()=> agent.TestErrors.get401Error().catch(error=>console.log(error))}>get 401 Error
              </Button>
              <Button variant="contained" onClick={()=> agent.TestErrors.get404Error().catch(error=>console.log(error))}>get 404 Error
              </Button>
              <Button variant="contained" onClick={()=>{ navigate('ServerError');
            agent.TestErrors.get500Error().catch(error=>console.log(error))
            } }>get 500 Error
              </Button>
              {/* ()=> agent.TestErrors.get500Error().catch(error=>console.log(error)) */}
              <Button variant="contained" onClick={getValidationError}>get validation Error
              </Button>
            </ButtonGroup>

            {
              validationErrors.length > 0 &&

              <Alert severity="error">
                <AlertTitle>Validation Errors</AlertTitle>
                  <List>
                    {validationErrors.map(error =>(
                      <ListItem key={error}> 
                        <ListItemText>{error}</ListItemText>
        
                      </ListItem>
                    ))}
                  </List>
              </Alert>
            }
          
          </Container>
        </>
    )
}