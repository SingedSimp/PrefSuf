const { getModule, getModuleByDisplayName, React } = require('powercord/webpack');
/** @type {import("../../../fake_node_modules/powercord/components/settings/TextInput")} */
const Category = require("powercord/components/settings/TextInput");
const List = require("./components/List");
const { TextInput, SwitchItem, SliderInput, Toggle } = require('powercord/components/settings');
const { dialog } = require("electron");

module.exports = ({ getSetting, updateSetting}) => {
  const [channels, setChannels] = React.useState(JSON.parse(window.localStorage.getItem("excluded-channel")) ?? []);
  const [selectedChannelID, setSelectedChannelID] = React.useState(channels[0] ?? "");
  const [channelTextInputText, setChannelInputText] = React.useState("");

  const [servers, setServers] = React.useState(JSON.parse(window.localStorage.getItem("excluded-server")) ?? []);
  const [selectedserverID, setSelectedserverID] = React.useState(servers[0] ?? "");
  const [serverTextInputText, setServerInputText] = React.useState("");

  const { getChannel } = getModule(["getChannel"], false);
  const { getUser } = getModule(["getUser"], false);
  const { getGuild } = getModule(["getGuild"], false);


  return (
    <div className="prefix-remove-channel">
      <div className="prefix-remove-channel">
      <TextInput
      note="Set Prefix for the plugin to add. Requires reload to apply changes."
      defaultValue={getSetting('prefix', '')}
      required={false}
      onChange={val => updateSetting('prefix', val)}
    >
      Prefix
    </TextInput>
    </div><div className="prefix-remove-channel">
    <TextInput
      note="Set Prefix for the plugin to add. Requires reload to apply changes."
      defaultValue={getSetting('suffix', '')}
      required={false}
      onChange={val => updateSetting('suffix', val)}
    >
      Suffix
    </TextInput>
    </div>



      <div className="prefix-remove-channel">
        <TextInput
          note="Channel ID of an new excluded channel (you can also put a user id to ignore dm with specific user)"
          required={false}
          onChange={setChannelInputText}
          value={channelTextInputText}
        >
          Excluded channels & excluded users
       </TextInput>
        <List
          item={channels}
          name="Channel ID &amp; users"
          selectedItem={selectedChannelID}
          onSelectItem={setSelectedChannelID}
        />
        <div className="manage-channel-control">
          <button onClick={async function () {
            /** @type {string[]} */
            const excludedChannel = JSON.parse(window.localStorage.getItem("excluded-channel")) ?? [];
            if (!channelTextInputText || Number(channelTextInputText) === NaN || excludedChannel.includes(channelTextInputText))
              return;
            try {
              excludedChannel.push(`${getChannel(channelTextInputText).id} (${getChannel(channelTextInputText).name} in the discord server ${getGuild(getChannel(channelTextInputText).guild_id).name})`);
              window.localStorage.setItem("excluded-channel", JSON.stringify(excludedChannel));
              setChannels(excludedChannel);
            }
            catch (e) {
              // try to add a user if it cant add a user
              try {
                if (/\d+/.test(channelTextInputText))
                  setChannelInputText("");
                const user = await getUser(channelTextInputText);
                excludedChannel.push(`${channelTextInputText} (user ${user.username})`);
                window.localStorage.setItem("excluded-channel", JSON.stringify(excludedChannel));
                setChannels(excludedChannel);
              }
              catch (e2) {

              }
            }
            finally {
              setChannelInputText("");
            }
          }}>Add channel</button>
          <button onClick={function () {
            try {

              /** @type {string[]} */
              let excludedChannel = JSON.parse(window.localStorage.getItem("excluded-channel")) ?? [];
              if (selectedChannelID)
                excludedChannel = excludedChannel.filter(e => e != selectedChannelID); // will return ['A', 'C']
              else if (selectedChannelID == "" || channels.length < 2)
                excludedChannel.pop();

              window.localStorage.setItem("excluded-channel", JSON.stringify(excludedChannel));
              setChannels(excludedChannel);
            } catch { }
          }}>Remove selected channel</button>
        </div>
      </div>

      <div class="divider-3573oO dividerDefault-3rvLe-"></div>

      <div className="prefix-remove-channel">
        
        <TextInput
          note="Server ID of an server to exclude"
          required={false}
          onChange={setServerInputText}
          value={serverTextInputText}
        >
          Excluded server
       </TextInput>
        <List
          item={servers}
          name="Excluded servers"
          selectedItem={selectedserverID}
          onSelectItem={setSelectedserverID}
        />
        <div className="manage-channel-control">
          <button onClick={function () {
            /** @type {string[]} */
            const excludedserver = JSON.parse(window.localStorage.getItem("excluded-server")) ?? [];
            if (!serverTextInputText || Number(serverTextInputText) === NaN || excludedserver.includes(serverTextInputText))
              return;

            try {
              excludedserver.push(serverTextInputText + " (" + getGuild(serverTextInputText).name + ")");
              window.localStorage.setItem("excluded-server", JSON.stringify(excludedserver));
              setServers(excludedserver);
            }
            catch (e) {
            }
            finally {
              setServerInputText("");
            }
          }}>Add server</button>

          <button onClick={function () {
            /** @type {string[]} */
            let excludedserver = JSON.parse(window.localStorage.getItem("excluded-server")) ?? [];
            if (selectedserverID)
              excludedserver = excludedserver.filter(e => e != selectedserverID); // will return ['A', 'C']
            else if (selectedserverID == "" || servers.length < 2)
              excludedserver.pop();

            window.localStorage.setItem("excluded-server", JSON.stringify(excludedserver));
            setServers(excludedserver);
          }}>Remove selected server</button>
        </div>
      </div>

    </div>
  );
};
