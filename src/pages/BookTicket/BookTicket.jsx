import React, { useEffect } from 'react'
import BookTicketForm from '../../components/BookTickets/BookTicketForm'

const BookTicket = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className='mt-25'>
        <BookTicketForm/>
    </div>
  )
}

export default BookTicket