namespace alphanum {
    let DEFAULT_ADDRESS = 0x70;
    let HT16K33_BLINK_CMD = 0x80
    let HT16K33_BLINK_DISPLAYON = 0x01
    let HT16K33_BLINK_OFF = 0x00
    let HT16K33_BLINK_2HZ = 0x02
    let HT16K33_BLINK_1HZ = 0x04
    let HT16K33_BLINK_HALFHZ = 0x06
    let HT16K33_SYSTEM_SETUP = 0x20
    let HT16K33_OSCILLATOR = 0x01
    let HT16K33_CMD_BRIGHTNESS = 0xE0

    let buffer = pins.createBuffer(17);

    /**
     * Alphanumeric LED Display
     */

    //% blockId=initialise_alphanumeric
    //% block = "Initialse the display"
    export function initialise_alphanumeric(i2cAddress = DEFAULT_ADDRESS): void {
        // Init
        pins.i2cWriteNumber(
            i2cAddress,
            HT16K33_SYSTEM_SETUP | HT16K33_OSCILLATOR,
            NumberFormat.UInt8LE,
            false
        )
        // Blink rate
        pins.i2cWriteNumber(
            i2cAddress,
            HT16K33_BLINK_CMD | 1,
            NumberFormat.UInt8LE,
            false
        )
        // Brightness
        pins.i2cWriteNumber(
            i2cAddress,
            HT16K33_CMD_BRIGHTNESS | 0,
            NumberFormat.UInt8LE,
            false
        )
    }

    //% blockId=alphanum_write_raw
    //% block = "Write raw bits"
    export function write_raw(pos: number, bitmask: number): void {
        buffer[1 + pos * 2] = bitmask & 0xff
        buffer[1 + pos * 2 + 1] = (bitmask >> 8) & 0xff
    }

    //% blockId=alphanum_update_display
    //% block = "Update the display"
    export function update_display(): void {
        pins.i2cWriteBuffer(112, buffer, false)
    }
}