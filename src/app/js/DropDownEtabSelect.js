import React from 'react';
import Select from 'react-select';
const liEtab = require('../../../config/listInstitutions.json');

const strOptions = JSON.stringify(liEtab)
    .replace(/"id"/g, '"value"')
    .replace(/"text"/g, '"label"');
const options = JSON.parse(strOptions);

class DropDownEtabSelect extends React.Component {
    state = {
        selectedOption: null,
    };

    handleChange = selectedOption => {
        this.setState({ selectedOption });

        window.sessionStorage.setItem('PanistIdc', selectedOption.value);
        window.sessionStorage.setItem('PanistEtabName', selectedOption.label);

        location.reload();
    };

    selectPlaceHolder = () => {
        if (typeof window === 'undefined') {
            return 'Séléctionnez votre établissement';
        }
        let etabName = window.sessionStorage.getItem('PanistEtabName');
        if (etabName !== null) return etabName;

        return 'Séléctionnez ici votre établissement';
    };

    render() {
        const { selectedOption } = this.state;
        const placeHolderToShow = this.selectPlaceHolder();

        return (
            <Select
                defaultValue={{
                    label: this.state.etabNameSelected,
                    value: this.state.idcSelected,
                }}
                value={selectedOption}
                onChange={this.handleChange}
                options={options}
                menuPlacement="top"
                placeholder={placeHolderToShow}
            />
        );
    }
}

export default DropDownEtabSelect;
