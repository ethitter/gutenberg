/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import {
	Button,
	IconButton,
	PanelBody,
	Placeholder,
	SelectControl,
	Toolbar,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	ServerSideRender,
} from '@wordpress/editor';

import WidgetEditHandler from './WidgetEditHandler';

class LegacyWidgetEdit extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			isPreview: false,
		};
		this.switchToEdit = this.switchToEdit.bind( this );
		this.switchToPreview = this.switchToPreview.bind( this );
		this.changeWidget = this.changeWidget.bind( this );
	}

	render() {
		const { attributes, availableLegacyWidgets, setAttributes } = this.props;
		const { isPreview } = this.state;
		const { identifier } = attributes;
		const widgetObject = identifier && availableLegacyWidgets[ identifier ];
		if ( ! widgetObject ) {
			return (
				<Placeholder
					icon={ <BlockIcon icon="admin-customizer" /> }
					label={ __( 'Legacy Widget' ) }
				>
					<SelectControl
						label={ __( 'Select a legacy widget to display:' ) }
						value={ identifier || 'none' }
						onChange={ ( value ) => setAttributes( {
							instance: {},
							identifier: value,
						} ) }
						options={ [ { value: 'none', label: 'Select widget' } ].concat(
							map( availableLegacyWidgets, ( widget, key ) => {
								return {
									value: key,
									label: widget.name,
								};
							} )
						) }
					/>
				</Placeholder>
			);
		}
		return (
			<Fragment>
				<BlockControls>
					<Toolbar>
						<IconButton
							className="components-icon-button components-toolbar__control"
							label={ __( 'Change widget' ) }
							onClick={ this.changeWidget }
							icon="edit"
						/>
						<Button
							className={ `components-tab-button ${ ! isPreview ? 'is-active' : '' }` }
							onClick={ this.switchToEdit }
						>
							<span>{ __( 'Edit' ) }</span>
						</Button>
						<Button
							className={ `components-tab-button ${ isPreview ? 'is-active' : '' }` }
							onClick={ this.switchToPreview }
						>
							<span>{ __( 'Preview' ) }</span>
						</Button>
					</Toolbar>
				</BlockControls>
				<InspectorControls>
					<PanelBody title={ widgetObject.name }>
						{ widgetObject.description }
					</PanelBody>
				</InspectorControls>
				{ ! isPreview && (
					<WidgetEditHandler
						identifier={ attributes.identifier }
						instance={ attributes.instance }
						onInstanceChange={
							( newInstance ) => {
								this.props.setAttributes( {
									instance: newInstance,
								} );
							}
						}
					/>
				) }
				{ isPreview && (
					<ServerSideRender
						className="wp-block-legacy-widget__preview"
						block="core/legacy-widget"
						attributes={ attributes }
					/>
				) }
			</Fragment>
		);
	}

	changeWidget() {
		this.switchToEdit();
		this.props.setAttributes( {
			instance: {},
			identifier: undefined,
		} );
	}

	switchToEdit() {
		this.setState( { isPreview: false } );
	}

	switchToPreview() {
		this.setState( { isPreview: true } );
	}
}

export default withSelect( ( select ) => {
	const editorSettings = select( 'core/editor' ).getEditorSettings();
	const { availableLegacyWidgets } = editorSettings;
	return {
		availableLegacyWidgets,
	};
} )( LegacyWidgetEdit );
