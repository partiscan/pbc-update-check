# pbc-update-check

Script that checks if a node is (soon) busy, or if it is fine to update.

## How it works

The script checks for two scenarios:

1.  Soon to produce blocks
2.  New committee forming

It uses the node apis to get information of the on-chain activity. Written in Node, Feel free to port to other languages

## Usage

Compile typescript, run the script with node in your update script, exit on error code, otherwise update.

## Configuration

The values in `src/config.ts` can be tweaked to be more or less sensitive. Set `MAIN_API` to point to your node's API endpoint. Set the environment variable `NODE_ADDRESS` to your nodes PBC account.

## Considerations

Review this carefully before use

### Error scenarios

The script tries to allow updates if an error occurs (it is important not to get stuck in a wont-update loop). Be sure to check if your node has updated within a few days of a release.

### Update frequency

Currently, a lot of nodes only check for updates once a day. Updates could be delayed quite a bit if a node is unlucky. Maybe it is fine to check for updates a bit more frequent than that. Could update cronjob to run frequent, but introduce waiting with a timestamp in a persistent file.

### ZK and Oracle

Not sure if there are any extra considerations here? What happens if a node is supposed to do ZK or Oracle work?
