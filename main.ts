/**
 * Controls the Adafruit 7-segment and 14-segment numeric/character led displays
 */
//% color="coral" icon="\uf06e"
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

    let usedi2cAddress: number = DEFAULT_ADDRESS;

    let buffer = pins.createBuffer(17);

    let chars: { [key: string]: number } = { ' ': 0, '!': 6, '"': 544, '#': 4814, '$': 4845, '%': 3108, '&': 9053, "'": 1024, '(': 9216, ')': 2304, '*': 16320, '+': 4800, ',': 2048, '-': 192, '.': 0, '/': 3072, '0': 3135, '1': 6, '2': 219, '3': 143, '4': 230, '5': 8297, '6': 253, '7': 7, '8': 255, '9': 239, ':': 4608, ';': 2560, '<': 9216, '=': 200, '>': 2304, '?': 4227, '@': 699, 'A': 247, 'B': 4751, 'C': 57, 'D': 4623, 'E': 249, 'F': 113, 'G': 189, 'H': 246, 'I': 4608, 'J': 30, 'K': 9328, 'L': 56, 'M': 1334, 'N': 8502, 'O': 63, 'P': 243, 'Q': 8255, 'R': 8435, 'S': 237, 'T': 4609, 'U': 62, 'V': 3120, 'W': 10294, 'X': 11520, 'Y': 5376, 'Z': 3081, '[': 57, '\\': 8448, ']': 15, '^': 3075, '_': 8, '`': 256, 'a': 4184, 'b': 8312, 'c': 216, 'd': 2190, 'e': 2136, 'f': 113, 'g': 1166, 'h': 4208, 'i': 4096, 'j': 14, 'k': 13824, 'l': 48, 'm': 4308, 'n': 4176, 'o': 220, 'p': 368, 'q': 1158, 'r': 80, 's': 8328, 't': 120, 'u': 28, 'v': 8196, 'w': 10260, 'x': 10432, 'y': 8204, 'z': 2120, '{': 2377, '|': 4608, '}': 9353, '~': 1312 };

    let digits: { [key: string]: number } = { ' ': 0, '-': 64, '0': 63, '1': 6, '2': 91, '3': 79, '4': 102, '5': 109, '6': 125, '7': 7, '8': 127, '9': 111, 'A': 119, 'B': 124, 'C': 57, 'D': 94, 'E': 121, 'F': 113 };

    /**
     * Segment LED Display
     */
    //% blockId=initialise_set_i2c_address
    //% block = "Set the i2c address"
    export function set_i2c_address(i2cAddress: number): void {
        usedi2cAddress = i2cAddress
    }

    //% blockId=initialise led_display
    //% block = "Initialse the display"
    export function initialise_led_display(): void {

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
            HT16K33_CMD_BRIGHTNESS | 0,
            NumberFormat.UInt8LE,
            false
        )
    }

    /**
     * AWrite raw bits to turn on individual segments
     */
    //% blockId=alphanum_write_raw
    //% block = "Write raw bits $bitmask at $position"
    //% position.min=0 position.max=3
    export function write_raw(position: number, bitmask: number): void {
        buffer[1 + position * 2] = bitmask & 0xff
        buffer[1 + position * 2 + 1] = (bitmask >> 8) & 0xff
    }

    //% blockId=alphanum_update_display
    //% block = "Update the display"
    export function update_display(): void {
        pins.i2cWriteBuffer(usedi2cAddress, buffer, false)
    }

    //% blockId=alphanum_clear_display
    //% block = "Clear the display"
    export function clear_display(): void {
        for (let index = 0; index <= 16; index++) {
            buffer[index] = 0
        }
    }

    //% blockId=alphanum_set_character
    //% block = "Set an alphanumeric character at $position"
    //% position.min=0 position.max=3
    export function set_character(position: number, character: string): void {
        write_raw(position, chars[character])
    }

    //% blockId=alphanum_set_string
    //% block = "Set an alphanumeric string on the display (4 characters)"
    export function set_string(character: string): void {
        write_raw(0, chars[character.charAt(0)])
        write_raw(1, chars[character.charAt(1)])
        write_raw(2, chars[character.charAt(2)])
        write_raw(3, chars[character.charAt(3)])

    }

    //% blockId=alphanum_set_digit
    //% block = "Set a numberic digit at $position"
    //% position.min=0 position.max=3
    export function set_digit(position: number, digit: number): void {
        write_raw(position, digits[digit])
    }
}
