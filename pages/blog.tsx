import React from "react";

const StoryblokClient = require('storyblok-js-client')
import { useState, useEffect } from 'react';

// 2. Initialize the client with the preview token
// from your space dashboard at https://app.storyblok.com
let Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN
})
const stories = [];

function Blog({ props }) {
  useEffect(() => {
  });

  return (
    <div className="vaults-container">
      <div className="vaults-title">
        <h1>blog</h1>
      </div>
      <br />

      <div>
        {
          stories.map((story, index) => {
            console.log(story.story.name)
            return (
              <h2 key="{index}">{story.story.name}</h2>
            )
          })
        }
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  var response = await Storyblok
    .get('cdn/stories/', {
      version: 'draft'
    })

  for (const story of response.data.stories) {
    if (story.published_at != null) {
      stories.push({ story });
    }
  }
  return {
    props: { stories, }, // will be passed to the page component as props
  }
}

//}

export default Blog
