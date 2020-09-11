This is a bot that I created for the Discord servers that my friends and I use. It's just for funsies, so I don't have any testing or anything like that integrated into the project.

If you were to want to run this locally (I don't know why you would), you would need to get an API key from Discord and reference it in the `env.ts` file in the home directory. `.env` also includes all sorts of specific IDs that I didn't bother writing down in the example because they wouldn't do you any good anyway.

You would also need to populate `src/sfx` with several folders full of sound effects.
A few of those files are referenced directly, so you would also have to edit `src/sfx/index.ts` to no longer reference them.

Once you've done all that, you can run the TS build, navigate to the `build/src` directory with your CLI of choice, and run `node bot.js`. The bot would then connect to your server and do its thing.

I probably missed a few steps because this reamde is literally just for friends and potential employers, and I don't expect - or want, really - anyone to actually use this bot. This is just a goofy thing that serves little to no practical purpose.