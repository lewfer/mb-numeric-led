/**
 * Controls the Adafruit 7-segment numeric led display
 */
//% color="#ff7f50" icon="\uf06e" block="Numeric LED"
namespace numeric_led {
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

    let usedi2cAddress: number = DEFAULT_ADDRESS;

    let buffer = pins.createBuffer(17);

    let digits: { [key: string]: number } = { ' ': 0, '-': 64, '0': 63, '1': 6, '2': 91, '3': 79, '4': 102, '5': 109, '6': 125, '7': 7, '8': 127, '9': 111, 'A': 119, 'B': 124, 'C': 57, 'D': 94, 'E': 121, 'F': 113 };

    /**
     * Segment LED Display
     */
    //% blockId=set_display_i2c_address
    //% block="set display i2c address %i2cAddress"
    export function set_display_i2c_address(i2cAddress: number): void {
        usedi2cAddress = i2cAddress
    }

    //% blockId=initialise_numeric_led
    //% block="initialise numeric led"
    export function initialise_numeric_led(): void {

        // Init
        pins.i2cWriteNumber(
            usedi2cAddress,
            HT16K33_SYSTEM_SETUP | HT16K33_OSCILLATOR,
            NumberFormat.UInt8LE,
            false
        )
        // Blink rate
        pins.i2cWriteNumber(
            usedi2cAddress,
            HT16K33_BLINK_CMD | 1,
            NumberFormat.UInt8LE,
            false
        )
        // Brightness
        pins.i2cWriteNumber(
            usedi2cAddress,
            HT16K33_CMD_BRIGHTNESS | 15,
            NumberFormat.UInt8LE,
            false
        )
    }

    /**
     * Write raw bits to turn on individual segments
     */
    //% blockId=write_raw
    //% block="write raw %bitmask at %position"
    //% position.min=0 position.max=3
    function write_raw(bitmask: number, position: number): void {
        let offset = position<2?0:1
        buffer[1 + (offset+position) * 2] = bitmask & 0xff
        buffer[1 + (offset+position) * 2 + 1] = (bitmask >> 8) & 0xff
    }

    //% blockId=update_display
    //% block="update display"
    export function update_display(): void {
        pins.i2cWriteBuffer(usedi2cAddress, buffer, false)
    }

    //% blockId=clear_display
    //% block="clear display"
    export function clear_display(): void {
        for (let index = 0; index <= 16; index++) {
            buffer[index] = 0
        }
    }

    //% blockId=display_number
    //% block="display number %value"
    export function display_number(value: number): void {
        let str = value.toString()
        write_raw(digits[str.charAt(0)], 0)
        write_raw(digits[str.charAt(1)], 1)
        write_raw(digits[str.charAt(2)], 2)
        write_raw(digits[str.charAt(3)], 3)
        pins.i2cWriteBuffer(usedi2cAddress, buffer, false)
    }

    //% blockId=display_digit
    //% block="display digit %digit at %position"
    //% position.min=0 position.max=3
    export function display_digit(digit: number, position: number): void {
        write_raw(digits[digit], position)
    }
}
