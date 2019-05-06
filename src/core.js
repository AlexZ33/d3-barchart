import * as d3 from 'd3'
import 'd3-selection-multi'
/**
 *生成svg画布
 *
 * @export
 * @param {*} el
 * @param {*} width
 * @param {*} height
 * @returns
 */
export function genSVG (el, width, height) {
  return d3.select(el).append('svg').attrs({ width, height })
}