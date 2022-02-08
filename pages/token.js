import React from "react";

import StoryblokClient from 'storyblok-js-client';
import { render, NODE_IMAGE } from "storyblok-rich-text-react-renderer"
import { useState, useEffect } from 'react';

let Storyblok = new StoryblokClient({
    accessToken: process.env.STORYBLOK_ACCESS_TOKEN
})

function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}

function getTime(dateTime) {
    let hours = dateTime.getHours().toString();
    if (hours.length == 1) {
        hours = "0" + hours;
    }
    let minutes = dateTime.getMinutes().toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
}

function isEmpty(str) {
    return (!str || str.length === 0 );
}

async function fetchMyAPI() {
    let stuff = [];
    console.log('start fetch');
    var response = await Storyblok
        .get('cdn/stories/', {
            version: 'draft'
        })

    for (const story of response.data.stories) {
        if (story.published_at != null) {
            stuff.push({ story });
        }
    }
    console.log('fetch');
    return stuff
}

function Blog() {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)
    var stories = [];

    useEffect(() => {
        setLoading(true)
        Storyblok
            .get('cdn/stories/', {
                version: 'draft'
            })
            .then((data) => {
                setData(data)

                setLoading(false)
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    //if (isLoading) return <p>Loading...</p>
    if (data) {
        for (const story of data.data.stories) {
            if (story.published_at != null) {
                console.log(story.full_slug);
                if (story.full_slug.includes("token/") ) {
                    stories.push({story});
                }
            }
        }
    }


    console.log(stories)

    return (
        <div>
            <h1>
                <div className="hot-container">
                    <div className="vaults-title">
                        <h1>Token</h1>
                    </div>
                    <br/>
                    {
                        stories.map((story, index) => {
                            let story_image = "";
                            let the_story = story.story;
                            if (the_story.content.image) {
                                story_image = <div ><img className="hot-image" img src={ "https:" + the_story.content.image}/></div>
                            }

                            let start_date = "";
                            let end_date = "";
                            let start_time = "";
                            let end_time = "";
                            let event_time = "";
                            let s_date;
                            let e_date;
                            let content = story.story
                            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

                            if (content.first_published_at != "") {
                                s_date = new Date(content.first_published_at);

                                start_date = s_date.toLocaleDateString(undefined, options);
                                start_time = getTime(s_date);
                            }

                            return(
                                <div>
                                    {story_image}
                                    <br/>
                                    <div className="hot-topic">{story.story.content.title}</div>
                                    <div className="hot-date">{start_date}</div>
                                    <hr className="hot-bar"/>
                                    <div className="hot-body">{story.story.content.intro}</div><br/>
                                    <div className="hot-body">{render(story.story.content.long_text, {
                                        nodeResolvers: {
                                            [NODE_IMAGE]: (children, props) => <img {...props} style={{borderRadius: '0px', width: '100%'}}/>
                                        },
                                        blokResolvers: {
                                            ['YouTube-blogpost']: (props) => (
                                                <div class="embed-responsive embed-responsive-16by9">
                                                    <iframe class="embed-responsive-item" src={ "https://www.youtube.com/embed/" + props.YouTube_id.replace('https://youtu.be/', '')  }></iframe>
                                                </div>
                                            )
                                        }
                                    })}</div>
                                </div>
                            )
                        })
                    }
                </div>

            </h1>
            <p></p>
        </div>
    )
}

// export async function getStaticProps() {
//
//     const stories = [];
//   var response = await Storyblok
//     .get('cdn/stories/', {
//       version: 'draft'
//     })
//
//   for (const story of response.data.stories) {
//     if (story.published_at != null) {
//       stories.push({ story });
//     }
//   }
// console.log(stories)
//   return {
//         props: {
//             stories,
//         },
//     }
// }

//}

export default Blog
