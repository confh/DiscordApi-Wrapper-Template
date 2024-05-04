import Event from "../classes/Event";
import CustomClient from "../classes/CustomClient";

module.exports = new Event({
    name: "ready",
    once: true,
    execute(client: CustomClient) {
        client.logger.info(`${client.user.displayName} IS ON!`)
        client.editStatus("dnd")
        client.deployCommands()
        client.deployWebsite()
    }
})