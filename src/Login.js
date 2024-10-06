import React from 'react'
import {Grid, Image } from 'semantic-ui-react'
import popcat from './Images/popcat.jpg' // Import the image

const Login = () => (
  <div>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
        <img src={popcat} alt="Logo" style={{ width: '50px', height: '50px' }}/> Log-in to your account
          </Grid.Column>
        </Grid>
    </div>
)
// Presentacion empieza product owner, luego scrum master, luego equipo de desarrollo,
// Product owner presenta el comrpomiso del sprint anterior y el resultado, luego el scrum master presenta el sprint backlog desde el punto de vista de las tareas realizadas para ese resultado y JIRA. DEsglose de actividades en sprint backlog, tablero, actividaes realizadas y no terminadas y el burntdown chart.
//Desarrollo presenta la parte tecnica, diagrama de arquitectura, parte que implementaron. tecnologias, servicios, interconexion, etc.
// 15 minutos
export default Login