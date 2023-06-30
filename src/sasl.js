/**
 * Encapsulates an SASL authentication mechanism.
 *
 * User code may override the priority for each mechanism or disable it completely.
 * See <priority> for information about changing priority and <test> for informatian on
 * how to disable a mechanism.
 *
 * By default, all mechanisms are enabled and t_he priorities are
 *
 *     SCRAM-SHA-512 - 72
 *     SCRAM-SHA-384 - 71
 *     SCRAM-SHA-256 - 70
 *     SCRAM-SHA-1   - 60
 *     PLAIN         - 50
 *     OAUTHBEARER   - 40
 *     X-OAUTH2      - 30
 *     ANONYMOUS     - 20
 *     EXTERNAL      - 10
 *
 * See: {@link Strophe.Connection#registerSASLMechanisms}
 *
 * @memberof Strophe
 */
class SASLMechanism {
    /**
     * PrivateConstructor: Strophe.SASLMechanism
     * SASL auth mechanism abstraction.
     *
     * @param {String} name - SASL Mechanism name.
     * @param {Boolean} isClientFirst - If client should send response first without challenge.
     * @param {Number} priority - Priority.
     *
     * @return {SASLMechanism}
     */
    constructor(name, isClientFirst, priority) {
        /** PrivateVariable: mechname
         * Mechanism name.
         */
        this.mechname = name;

        /**
         * If client sends response without initial server challenge.
         * @private
         */
        this.isClientFirst = isClientFirst;

        /**
         * Determines which <SASLMechanism> is chosen for authentication (Higher is better).
         * Users may override this to prioritize mechanisms differently.
         *
         * Example: (This will cause Strophe to choose the mechanism that the server sent first)
         *
         * > Strophe.SASLPlain.priority = Strophe.SASLSHA1.priority;
         *
         * See <SASL mechanisms> for a list of available mechanisms.
         * @private
         */
        this.priority = priority;
    }

    /**
     * Checks if mechanism able to run.
     * To disable a mechanism, make this return false;
     *
     * To disable plain authentication run
     * > Strophe.SASLPlain.test = function() {
     * >   return false;
     * > }
     *
     * See <SASL mechanisms> for a list of available mechanisms.
     * @param {Strophe.Connection} connection - Target Connection.
     * @return {boolean} If mechanism was able to run.
     */
    // eslint-disable-next-line class-methods-use-this
    test() {
        return true;
    }

    /**
     * Called before starting mechanism on some connection.
     * @private
     * @param {Strophe.Connection} connection - Target Connection.
     */
    onStart(connection) {
        this._connection = connection;
    }

    /**
     * Called by protocol implementation on incoming challenge.
     *
     * By deafult, if the client is expected to send data first (isClientFirst === true),
     * this method is called with `challenge` as null on the first call,
     * unless `clientChallenge` is overridden in the relevant subclass.
     * @private
     * @param {Strophe.Connection} connection - Target Connection.
     * @param {String} challenge - current challenge to handle.
     * @return {string} Mechanism response.
     */
    // eslint-disable-next-line no-unused-vars, class-methods-use-this
    onChallenge(connection, challenge) {
        throw new Error('You should implement challenge handling!');
    }

    /**
     * Called by the protocol implementation if the client is expected to send
     * data first in the authentication exchange (i.e. isClientFirst === true).
     * @private
     * @param {Strophe.Connection} connection - Target Connection.
     * @return {string} Mechanism response.
     */
    clientChallenge(connection) {
        if (!this.isClientFirst) {
            throw new Error('clientChallenge should not be called if isClientFirst is false!');
        }
        return this.onChallenge(connection);
    }

    /**
     * Protocol informs mechanism implementation about SASL failure.
     * @private
     */
    onFailure() {
        this._connection = null;
    }

    /**
     * Protocol informs mechanism implementation about SASL success.
     * @private
     */
    onSuccess() {
        this._connection = null;
    }
}

export default SASLMechanism;
