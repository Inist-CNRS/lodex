import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = StyleSheet.create({
    li: {
        listStyleType: 'none',
    },
});

const IstexList = ({ data, children, polyglot, ...props }) => {
    if (!data.length) {
        return (
            <ul>
                <li className={css(styles.li)}>
                    {polyglot.t('istex_no_result')}
                </li>
            </ul>
        );
    }
    return (
        <ul>
            {data.map((item, index) => (
                <li className={css(styles.li)} key={index}>
                    {children({ ...props, polyglot, item })}
                </li>
            ))}
        </ul>
    );
};

IstexList.propTypes = {
    data: PropTypes.array.isRequired,
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default IstexList;
