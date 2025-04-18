<?php

namespace Kirby\Sane;

use Kirby\Exception\InvalidArgumentException;

/**
 * Sane handler for gzip-compressed SVGZ files
 * @since 3.5.4
 *
 * @package   Kirby Sane
 * @author    Lukas Bestle <lukas@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier
 * @license   https://opensource.org/licenses/MIT
 */
class Svgz extends Svg
{
	/**
	 * Sanitizes the given string
	 *
	 * @param bool $isExternal Whether the string is from an external file
	 *                         that may be accessed directly
	 *
	 * @throws \Kirby\Exception\InvalidArgumentException If the file couldn't be parsed or recompressed
	 */
	public static function sanitize(
		string $string,
		bool $isExternal = false
	): string {
		$string = static::uncompress($string);
		$string = parent::sanitize($string, $isExternal);
		$string = @gzencode($string);

		if (is_string($string) !== true) {
			throw new InvalidArgumentException(message: 'Could not recompress gzip data'); // @codeCoverageIgnore
		}

		return $string;
	}

	/**
	 * Validates file contents
	 *
	 * @param bool $isExternal Whether the string is from an external file
	 *                         that may be accessed directly
	 *
	 * @throws \Kirby\Exception\InvalidArgumentException If the file couldn't be parsed
	 * @throws \Kirby\Exception\InvalidArgumentException If the file didn't pass validation
	 */
	public static function validate(
		string $string,
		bool $isExternal = false
	): void {
		$string = static::uncompress($string);
		parent::validate($string, $isExternal);
	}

	/**
	 * Uncompresses the SVGZ data
	 */
	protected static function uncompress(string $string): string
	{
		// only support uncompressed files up to 10 MB to
		// prevent gzip bombs from crashing the process
		$string = @gzdecode($string, 10000000);

		if (is_string($string) !== true) {
			throw new InvalidArgumentException(
				message: 'Could not uncompress gzip data'
			);
		}

		return $string;
	}
}
