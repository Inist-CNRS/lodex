import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';

const styles = StyleSheet.create({
    li: {
        listStyleType: 'none',
    },
});

const IstexList = ({ data, children }) => (
    <ul>
        {data.map((item, index) => (
            <li className={css(styles.li)} key={index}>
                {children(item)}
            </li>
        ))}
    </ul>
);

IstexList.propTypes = {
    data: PropTypes.array.isRequired,
    children: PropTypes.func.isRequired,
};

export default IstexList;
