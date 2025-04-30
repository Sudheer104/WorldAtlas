import React from 'react'

function Contact() {

  const handleFormSubmit = (formData) => {
    // console.log(formData.entries());
    const formInputData = Object.fromEntries(formData.entries());
    console.log(formInputData);
  };

  return (
    <section className="section-contact">
      <h2 className='container-title'>Contact us</h2>

      <div className='contact-wrapper container'>

        <form action={handleFormSubmit} >
          <input
            type="text"
            className='form-control'
            placeholder='Enter Your Name'
            name='username' //Important
            required
            autoComplete='off'
          />

          <input
            type="email"
            className='form-control'
            placeholder='Enter Your Name'
            name='email'
            required
            autoComplete='false'
          />

          <textarea
            className='form-control'
            rows="8"
            placeholder='Enter Your Message'
            name="message"
            required
            autoComplete='false'
          ></textarea>

          <button type='submit' value="send">Send</button> 
        </form>

      </div>
    </section>

  )
}

export default Contact