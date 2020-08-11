# goan_2020
## This will the back_end of our App
### The APIs we created thus far are :
  #### for authentication:
    /signUp
    /verifySignUP
    /logIn
  #### for playgrounds:
    /playgrounds/createPlayGround
    /playgrounds/updatePlayGround
    /playgrounds/createField
    /playgrounds/getFields/:G_playGroundId
    /playgrounds/getPlayGrounds
  #### for reservation:
    /reservation/getAvailableTimes/:FiledId/:Date
    /reservation/createReservaion
    /reservation/getAllPlayGround_Reservations/:playGroundId
  #### for player
    /player/getPlayerProfile/:playerId
    /player/getAllPlayer_Reservations/:playerId
    /player/searchPlayGrounds/:governate/:price
  #### for cancelation
    /cancel/cancelReservation
