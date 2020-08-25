This is a bot that I created for the Discord server that my friends and I use. It's just for funsies, so I don't have any testing or anything like that integrated into the project.

If you were to want to run this locally (I don't know why you would), you would need to get an API key from Discord and reference it in the `env.ts` file in the home directory.
`env.ts` also includes direct references to a few channel and user IDs, which you would have to remove or replace. (I'd also recommend changing the names so that they're not the names of my friends and I).

You would also need to populate `src/sfx` with `sound-board`, `server`, and `intros` folders, and put appropriate files in them.
A few of those files are referenced directly, so you would also have to edit `src/sfx/index.ts` to no longer reference them.

Once you've done all that, you can run the TS build, navigate to the `build/src` directory with your CLI of choice, and run `node bot.js`. The bot would then connect to your server and do its thing.

All that said, I do not recommend doing this, as you would be much better served just making your own bot that fits your own needs. This is just a goofy thing that serves little to no practical purpose.