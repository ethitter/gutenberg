/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { withInstanceId } from '@wordpress/compose';
import { Button } from '@wordpress/components';

import WidgetEditDomManager from './WidgetEditDomManager';

class WidgetEditHandler extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			form: null,
			idBase: null,
		};
		this.instanceUpdating = null;
		this.updateWidget = this.updateWidget.bind( this );
		this.requestWidgetUpdater = this.requestWidgetUpdater.bind( this );
	}

	componentDidMount() {
		this.isStillMounted = true;
		this.requestWidgetUpdater();
	}

	componentDidUpdate( prevProps ) {
		if (
			prevProps.instance !== this.props.instance &&
			this.instanceUpdating !== this.props.instance
		) {
			this.requestWidgetUpdater();
		}
		if ( this.instanceUpdating === this.props.instance ) {
			this.instanceUpdating = null;
		}
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	render() {
		const { instanceId, identifier } = this.props;
		const { id, idBase, form } = this.state;
		if ( ! identifier ) {
			return __( 'Not a valid widget.' );
		}
		if ( ! form ) {
			return null;
		}
		return (
			<div className="wp-block-legacy-widget__edit-container">
				<WidgetEditDomManager
					ref={ ( ref ) => {
						this.widgetEditDomManagerRef = ref;
					} }
					widgetNumber={ instanceId * -1 }
					id={ id }
					idBase={ idBase }
					form={ form }
				/>
				<Button
					className="wp-block-legacy-widget__update-button"
					isLarge
					onClick={ this.updateWidget }
				>
					{ __( 'Update' ) }
				</Button>
			</div>
		);
	}

	updateWidget() {
		if ( this.widgetEditDomManagerRef ) {
			const instanceChanges = this.widgetEditDomManagerRef.retrieveUpdatedInstance();
			this.requestWidgetUpdater( instanceChanges, ( response ) => {
				this.instanceUpdating = response.instance;
				this.props.onInstanceChange( response.instance );
			} );
		}
	}

	requestWidgetUpdater( instanceChanges, callback ) {
		const { identifier, instanceId, instance } = this.props;
		if ( ! identifier ) {
			return;
		}

		apiFetch( {
			path: '/wp/v2/widget-updater/',
			data: {
				identifier,
				instance,
				// use negative ids to make sure the id does not exist on the database.
				id_to_use: instanceId * -1,
				instance_changes: instanceChanges,
			},
			method: 'POST',
		} ).then(
			( response ) => {
				if ( this.isStillMounted ) {
					this.setState( {
						form: response.form,
						idBase: response.id_base,
						id: response.id,
					} );
					if ( callback ) {
						callback( response );
					}
				}
			}
		);
	}
}

export default withInstanceId( WidgetEditHandler );

