Joinly Documentation Website

This is the recoded documentation/features site for docs.joinly-bot.xyz.

Shared navigation: navbar.html is the single local source for the navbar. Every page loads it with fetch('/navbar.html'), so edit that file once to update the navbar everywhere.

Files: style.css (shared styles), navbar.html (shared navigation), index.html (home), and one folder per documentation page.

Deployment: import this folder into Vercel as a static site and add docs.joinly-bot.xyz to the project. Configure the DNS record Vercel provides. vercel.json enables clean routes.
