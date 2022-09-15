import { Alert, AlertTitle } from '@mui/material'
import React from 'react'

export default function MatchError() {
  return (
    <div className="d-flex justify-content-center mb-5 mt-4">
    <Alert severity="error" style={{"width":"70%"}}>
                        <AlertTitle>There Are No Any Result</AlertTitle>
                        No items were found matching your search.
                      </Alert> </div>
  )
}
