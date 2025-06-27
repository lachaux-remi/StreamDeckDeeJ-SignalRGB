export const Name = () =>"StreamDeck DeeJ";
export const VendorId = () => 0x5239;
export const ProductId = () => 0x0001;
export const Publisher = () => "LACHAUX Rémi";
export const Type = () => "HID";
export const Size = () => [4,4];
export const DefaultScale = () => 0.5;
export const ControllableParameters = () => [
    { property: "LightingMode", group: "lighting", label:"Lighting Mode", type:"combobox", values: ["Canvas", "Forced"], default: "Canvas" },
    { property: "ForcedColor", group: "lighting", label: "Forced Color", min: "0", max: "360", type: "color", default: "#FF0000" },
    { property: "ShutdownColor", group: "lighting", label: "Shutdown Color", min: "0", max: "360", type: "color", default: "#000000" },
];
export const Validate = endpoint => endpoint.interface === 2;
export const ImageUrl = () => "https://raw.githubusercontent.com/lachaux-remi/StreamDeckDeeJ-SignalRGB/main/assets/streamdeck_deej.png";

const channelArray = [ [ "Deck", 16 ] ];

export function Initialize()
{
    for(let channelID = 0; channelID < channelArray.length; channelID++) {
		device.addChannel(channelArray[channelID][0], channelArray[channelID][1]);
	}
}

export function Render()
{
	for(let channelID = 0; channelID < channelArray.length; channelID++) {
        sendChannel(channelID);
	}
}

export function Shutdown(systemSuspending = false) {
    for(let channelID = 0; channelID < channelArray.length; channelID++) {
        sendChannel(channelID, systemSuspending ? "#000000" : ShutdownColor);
    }
}

export function onLightingModeChanged(){
    // TODO
}

export function onForcedColorChanged(){
    // TODO
}

const sendChannel = (channelID, overideColor = null) => {
    const componentChannel = device.channel(channelArray[channelID][0]);
    const channelLedCount = componentChannel.ledCount > channelArray[channelID][1] ? channelArray[channelID][1] : componentChannel.ledCount;

    let rgbData = [];

    if (overideColor) {
        rgbData = device.createColorArray(overideColor, channelLedCount, "Inline");
    } else if (LightingMode === "Forced") {
        rgbData = device.createColorArray(ForcedColor, channelLedCount, "Inline");
    } else {
        rgbData = componentChannel.getColors("Inline");
    }
    
    device.write([ ...[ 0x02, 0xAA ], ...rgbData.splice(0, 48)], 50);
}