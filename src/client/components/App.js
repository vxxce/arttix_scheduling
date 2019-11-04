import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek } from "date-fns"
import '../../public/index.css'
import { Route, Switch, BrowserRouter } from "react-router-dom"
import { toTitleCase, formatShifts } from "../utils/utils"
import Header from "./pages/Header"
import ViewSchedule from './pages/ViewSchedule'
import UploadSchedule from "./pages/UploadSchedule"
import CreateSchedule from './pages/CreateSchedule'

const App = () => {
  const [user, setUser] = useState()
  const [shifts, setShifts] = useState()
  // TODO: presentMonday and presentSunday for implementing the week slider. Establishes date range of current week
  const presentMonday = format(startOfWeek(Date.now(), { weekStartsOn: 1 }), 'yyyy/MM/dd')
  const presentSunday = format(endOfWeek(Date.now(), { weekStartsOn: 1 }), 'yyyy/MM/dd')
  const [employees, setEmployees] = useState([])
  const weekdayColumnHeaders = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const buildings = ['Abravanel', 'Capitol', 'Delta Hall', 'Regent Street', 'Rose Wagner']
  const timeRowHeaders = ['8a', '10a', '12p', '2p', '4p', '6p', '8p']

  // Get employee names
  useEffect(() => {
    fetch('http://localhost:5000/employees', {method: 'GET'})
      .then(r => r.json())
      .then(r => setEmployees(r.map(empObj => empObj.name)))
  }, [])

  // Get user's shifts
  useEffect(() => {
    fetch(`http://localhost:5000/employees/${user}/shifts`, { method: 'GET' })
      .then(r => r.json())
      .then(rows => setShifts(formatShifts(rows)))
  }, [user])

  const handleUserChange = e => {
    e.preventDefault()
    setUser(e.target.value)
  }

  return (
    <>
      <BrowserRouter>
        <Header handleUserChange={handleUserChange} employees={employees}/>
        <main>
          <Switch>
            <Route path='/index.html'>
              <ViewSchedule shifts={shifts} weekdayColumnHeaders={weekdayColumnHeaders} timeRowHeaders={timeRowHeaders}/>
            </Route>
            <Route path='/upload'>
              <UploadSchedule />
            </Route>
            <Route path='/create'>
              <CreateSchedule weekdayColumnHeaders={weekdayColumnHeaders} employees={employees} buildings={buildings}/>
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App