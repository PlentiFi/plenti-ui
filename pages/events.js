import React from "react";

import StoryblokClient from 'storyblok-js-client';
import { render, NODE_IMAGE } from "storyblok-rich-text-react-renderer"
import { useState, useEffect } from 'react';
import mixpanel from 'mixpanel-browser';

mixpanel.init('e761a539fa2591e26b35a98c4ab85338');

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

    var response = await Storyblok
        .get('cdn/stories/', {
            version: 'draft'
        })

    console.log(response.data.stories);
    for (const story of response.data.stories) {
        if (story.published_at != null) {

            stuff.push({ story });
        }
    }

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

    if (data) {
        for (const story of data.data.stories) {
            if (story.published_at != null) {

                if (story.full_slug.includes("events/") ) {
                    stories.push({story});
                }
            }
        }
    }

    mixpanel.track('Page View', {
        'page': "events",
    });

    return (
        <div>
            <h1>
                <div className="hot-container">
                    <div className="vaults-title">
                        <h1>Events</h1>
                    </div>
                    <br/>
                    {


                        stories.map((story, index) => {
                            console.log(story);
                            let start_date = "";
                            let end_date = "";
                            let start_time = "";
                            let end_time = "";
                            let event_time = "";
                            let s_date;
                            let e_date;
                            let content = story.story.content
                            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                            let start_html = "";
                            let end_html = "";

                            let story_image = "";
                            let the_story = story.story;
                            if (the_story.content.Image) {
                                story_image = <div className="image-space"><img className="hot-image" img src={ "https:" + the_story.content.Image}/></div>
                            }


                            if (content.StartDate != "") {
                                let date_data = content.StartDate.split(" ")
                                let date_str = date_data[0]
                                start_time = date_data[1]

                                let utc_str = date_str + "T" + start_time + ":00.000+0000"

                                s_date = new Date(utc_str);

                                start_date = s_date.toLocaleDateString(undefined, options);
                                start_time = getTime(s_date);

                                start_html = <div className="hot-date">{start_date}</div>;
                            }

                            if (content.EndDate != "") {
                                let date_data = content.EndDate.split(" ")
                                let date_str = date_data[0]
                                end_time = date_data[1]

                                let utc_str = date_str + "T" + start_time + ":00.000+0000"

                                s_date = new Date(utc_str);

                                end_date = s_date.toLocaleDateString(undefined, options);
                                end_time = getTime(s_date);
                                end_html = <div className="hot-date">{end_date}</div>
                            }

                            let reg_link = ""
                            if (content.Register != "") {
                                reg_link =     <a href={content.Register} className="event-button" target="_blank">Register Now</a>
                            }

                            return(
                                <div>
                                    {story_image}
                                    <div className="hot-topic">{story.story.content.Title}</div>
                                    {start_html}
                                    {end_html}
                                    <hr className="hot-bar"/>
                                    <div className="hot-body">{render(story.story.content.Description, {
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
                                    {reg_link}

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


export default Blog
