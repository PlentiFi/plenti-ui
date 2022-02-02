// 1. Require the Storyblok client
const StoryblokClient = require('storyblok-js-client')

// 2. Initialize the client with the preview token
// from your space dashboard at https://app.storyblok.com
let Storyblok = new StoryblokClient({
    accessToken: 'CmrFyQGkPULc7jYNNGvwogtt'
})

export default function Post({ post }) {
    return <div>Post</div>
}

export async function getStaticPaths(params) {

   // console.log(params)
    var response = await Storyblok
        .get('cdn/stories/', {
            version: 'draft'
        })

    const paths = [];
    //console.log(response.data.stories);
    for (const story of response.data.stories) {
        if(story.published_at != null) {
            paths.push({params: { slug: "/posts/" + story.slug  }});
        }
    }

    console.log(paths);
    return { paths }

    // .then((response) => {
    //     const paths = [];
    //     console.log(response.data.stories);
    //     for (const story of response.data.stories) {
    //         if(story.published_at != null) {
    //             paths.push({params: { id: story.slug }});
    //         }
    //     }
    //
    //     return { paths, fallback: false }
    // })
    // .catch((error) => {
    //     console.log(error);
    // })
}


// This also gets called at build time
export async function getStaticProps({ params }) {
    console.log('test')
    console.log(params);
    // Storyblok
    //     .get(`cdn/stories/blog/${params.id}`, {
    //         version: 'draft'
    //     })
    //     .then((response) => {
    //         //console.log(response.data.story)
    //         // for (const story of response.data.stories) {
    //         //     if(story.published_at != null) {
    //         //         console.log(story);
    //         //     }
    //         // }
    //         //console.log(response.data.stories);
    //         //return { props: { response.data.story } }
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     })

    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    // const res = await fetch(`https://.../posts/${params.id}`)
    // const post = await res.json()
    //
    // // Pass post data to the page via props
    // return { props: { post } }
    return {
        props: {}, // will be passed to the page component as props
    }
}
