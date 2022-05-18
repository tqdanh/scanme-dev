import * as React from 'react';
import Downshift from 'downshift';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

type RenderInputProps = TextFieldProps & {
    classes: ReturnType<typeof useStyles>;
    ref?: React.Ref<HTMLDivElement>;
};

function renderInput(inputProps: RenderInputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,
            }}
            {...other}
        />
    );
}

interface RenderSuggestionProps {
    highlightedIndex: number | null;
    index: number;
    itemProps: MenuItemProps<'div', { button?: never }>;
    selectedItem: string;
    suggestion: any;
}

function renderSuggestion(suggestionProps: RenderSuggestionProps) {
    const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={index}
            selected={isHighlighted}
            component='div'
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {suggestion.label}
        </MenuItem>
    );
}

function getSuggestions(items: any, value: string, { showEmpty = false } = {}) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
        ? items
        : items.filter(item => {
            return item.label.toLowerCase().includes(inputValue);
        });
}

function GenericDownshift(props: any) {
    const { classes, input, placeholder, items, label, onItemSelected, convertData, objectModel, multipleSelect = true, required, onChangeInput } = props;
    const [inputValue, setInputValue] = React.useState('');
    const [selectedItems, setSelectedItem] = React.useState<string[]>([]);
    const [selectedItemObjectsReturned, setSelectedItemObjectsReturned] = React.useState<string[]>([]);
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (selectedItems.length && !inputValue.length && event.key === 'Backspace') {
            setSelectedItem(selectedItems.slice(0, selectedItems.length - 1));
        }
    };

    const handleInputChange = (event: React.ChangeEvent<{ value: string }>) => {
        onChangeInput(event);
        setInputValue(event.target.value);
    };

    const handleChange = (item: any) => {
        let format_item: any = item;
        if (item === null) {
            format_item = {label: inputValue, id: inputValue};
        }
        let newSelectedItem = [...selectedItems];
        if (!multipleSelect && newSelectedItem.length >= 1) { return; }
        newSelectedItem = [...newSelectedItem, format_item.label];
        setInputValue('');
        setSelectedItem(newSelectedItem);
         // pass item selected out side
        setTimeout(() => onItemsSelected(objectModel, items, newSelectedItem, onItemSelected, format_item, setSelectedItem, selectedItemObjectsReturned, setSelectedItemObjectsReturned), 0);
    };

    const handleDelete = (index: number) => {
        const _newSelectedItem = [...selectedItems];
        _newSelectedItem.splice(index, 1);
        setSelectedItem(_newSelectedItem);
        // pass item selected out side
        setTimeout(() => onItemsDelete(onItemSelected, index, selectedItemObjectsReturned, setSelectedItemObjectsReturned), 0);
    };

    return (
        <Downshift
            id='downshift-multiple'
            inputValue={inputValue}
            onChange={handleChange}
            selectedItem={selectedItems}
        >
            {({
                getInputProps,
                getItemProps,
                getLabelProps,
                isOpen,
                inputValue: inputValue2,
                selectedItem: selectedItem2,
                highlightedIndex,
            }) => {
                const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
                    onKeyDown: handleKeyDown,
                    placeholder,
                });
                return (
                    <div className={classes.container}>
                        {renderInput({
                            required,
                            fullWidth: true,
                            classes,
                            label,
                            InputLabelProps: getLabelProps(),
                            InputProps: {
                                startAdornment: selectedItems.map((item, index) => (
                                    <Chip
                                        key={index}
                                        tabIndex={-1}
                                        label={item}
                                        className={classes.chip}
                                        onDelete={() => handleDelete(index)}
                                    />
                                )),
                                onBlur,
                                onChange: event => {
                                    handleInputChange(event);
                                    onChange!(event as React.ChangeEvent<HTMLInputElement>);
                                },
                                onFocus: event => {
                                    handleInputChange(event);
                                    onChange!(event as React.ChangeEvent<HTMLInputElement>);
                                },
                            },
                            inputProps,
                        })}
                        {isOpen ? (
                            <Paper className={classes.paper} square>
                                {getSuggestions(convertData(items), inputValue2!).map((suggestion, index) =>
                                    renderSuggestion({
                                        suggestion,
                                        index,
                                        itemProps: getItemProps({ item: suggestion }),
                                        highlightedIndex,
                                        selectedItem: selectedItem2,
                                    }),
                                )}
                            </Paper>
                        ) : null}
                    </div>
                );
            }}
        </Downshift>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            height: 'auto',
        },
        container: {
            flexGrow: 1,
            position: 'relative',
        },
        paper: {
            position: 'absolute',
            zIndex: 1,
            marginTop: theme.spacing(1),
            left: 0,
            right: 0,
        },
        chip: {
            margin: theme.spacing(0.5, 0.25),
        },
        inputRoot: {
            flexWrap: 'wrap',
        },
        inputInput: {
            width: 'auto',
            flexGrow: 1,
        },
        divider: {
            height: theme.spacing(2),
        },
    }),
);

function onItemsSelected(objectModel: any, items: any, newSelectedItem: string[], onItemSelected: any, item: any, setSelectedItem, selectedItemObjectsReturned: any[], setSelectedItemObjectsReturned) {
    if (objectModel === 'ProductLine') {
        const selectedItem = items.filter(objectItem => {
            return objectItem.transactionId === item.transactionId;
        });
        // check if selectedItem has already in add list
        if (selectedItem.length > 0) {
            const testFind = selectedItemObjectsReturned.find(_item => {
                return _item.transactionId === selectedItem[0].transactionId;
            });
            if (!testFind) {
                const added_selectedItemObjectsReturned = [...selectedItemObjectsReturned, ...selectedItem];
                onItemSelected(added_selectedItemObjectsReturned);
                setSelectedItemObjectsReturned(added_selectedItemObjectsReturned);
            } else { // if already in the list then pop out the last added chip item
                const cloneArr = [...newSelectedItem];
                cloneArr.pop();
                setTimeout(() => setSelectedItem(cloneArr), 0);
            }
        }
    } else if (objectModel === 'organization') {
        const selectedItem = items.filter(objectItem => {
            return objectItem._id === item._id;
        });
        // check if selectedItem has already in add list
        if (selectedItem.length > 0) {
            const testFind = selectedItemObjectsReturned.find(_item => {
                return _item._id === selectedItem[0]._id;
            });
            if (!testFind) {
                const added_selectedItemObjectsReturned = [...selectedItemObjectsReturned, ...selectedItem];
                onItemSelected(added_selectedItemObjectsReturned);
                setSelectedItemObjectsReturned(added_selectedItemObjectsReturned);
            } else { // if already in the list then pop out the last added chip item
                const cloneArr = [...newSelectedItem];
                cloneArr.pop();
                setTimeout(() => setSelectedItem(cloneArr), 0);
            }
        }
    } else if (objectModel === 'metaKey') {
        onItemSelected(newSelectedItem);
    }
}

function onItemsDelete(onItemSelected: any, index: number, selectedItemObjectsReturned: any[], setSelectedItemObjectsReturned) {
    selectedItemObjectsReturned.splice(index, 1); // remember splice() return delete item
    onItemSelected(selectedItemObjectsReturned);
    setSelectedItemObjectsReturned([...selectedItemObjectsReturned]);
}

export default function IntegrationDownshift(props) {
    // @ts-ignore
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.divider} />
            <GenericDownshift {...props} classes={classes} />
            <div className={classes.divider} />
        </div>
    );
}
