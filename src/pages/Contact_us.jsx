import React from 'react'

const Contact_us = () => {

    const tags = [
        'BE CREATIVE', 'Improvisation', 'Guitar', 'Keyboard',
        'Composition', 'Harmony', 'Bass', 'Drum', 'Vocal'
    ];

    const TagComponent = ({tag}) => {
        return (
            <p className='tag_component'>{tag}</p>
        )
    }


    return (
        <div className='contact_wrap'>
            <p>Got a question?</p>

            {
                tags.map(tag => <TagComponent tag={tag} />)
            }

            <div className='carousel'>
                <span className='carousel_content'>
                <p>CONTACT US</p>
                <img src="./images/Contact_us/arrow_up_right.svg" alt="" />
                </span>
            </div>
        </div>
    )
}

export default Contact_us