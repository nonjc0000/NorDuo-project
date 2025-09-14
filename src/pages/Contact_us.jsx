import React from 'react'

const Contact_us = () => {

    const tags = [
        'Improvisation', 'BE CREATIVE', 'Guitar', 'Keyboard',
        'Composition', 'Harmony', 'Bass', 'Drum', 'Vocal'
    ];

    const tag_component = (tag) => {
        return (
            <div className='tag_component'>{tag}</div>
        )
    }


    return (
        <div>
            {
                tags.map(tag => <tag_component tag={tag} />)
            }
        </div>
    )
}

export default Contact_us