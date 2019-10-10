module.exports = {
  siteMetadata: {
    title: `def programming`,
    description: `Quotes about programming, coding, computer science, debugging, software industry, startups and motivation.`,
    author: `@davitferreira`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `defprogramming`,
        short_name: `defpro`,
        start_url: `/`,
        background_color: `#252525`,
        theme_color: `#252525`,
        display: `minimal-ui`,
        icon: `src/images/terminal-icon.png` // This path is relative to the root of the site.
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`
      }
    },
    `gatsby-plugin-react-svg`
  ]
};
