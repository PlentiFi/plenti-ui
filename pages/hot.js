import React from "react";

import StoryblokClient from 'storyblok-js-client';
import { render, NODE_IMAGE } from "storyblok-rich-text-react-renderer"
import { useState, useEffect } from 'react';

let Storyblok = new StoryblokClient({
    accessToken: process.env.STORYBLOK_ACCESS_TOKEN
})


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

function Hot() {
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

    if (isLoading) return <p>Loading...</p>
    if (data) {
        for (const story of data.data.stories) {
            if (story.published_at != null) {
                stories.push({ story });
            }
        }
    }

    console.log(stories)

    return (
        <div>
            <h1>
                <div className="hot-container">
                    <div className="vaults-title">
                        <h1>🔥Hot</h1>
                    </div>
                    <br/>
                    {
                        stories.map((story, index) => {
                            console.log(story.story);
                            return(
                                <div>
                                    <div className="hot-topic">{story.story.content.title}</div>
                                    <div className="hot-date">{story.story.first_published_at}</div>
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

export default Hot
