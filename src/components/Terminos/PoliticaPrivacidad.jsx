import React from 'react';

const PoliticasPrivacidad = () => {
    return (
        <div className="card mt-24 px-96 py-10    bg-gray-100 rounded-lg shadow-lg">
            <h1 className="font-bold text-4xl text-center text-green-600">Políticas de Privacidad</h1>
            <p className="text-gray-700 text-sm mt-4">Última actualización: [Fecha de actualización]</p>

            <h2 className="font-semibold text-xl text-gray-800 mt-6">Introducción</h2>
            <p className="text-gray-600 text-justify mt-2">
                El presente documento establece los términos en que Chameleon usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Estamos comprometidos con la seguridad de los datos de nuestros usuarios. Al utilizar este sitio web, aceptas las condiciones aquí descritas.
            </p>

            <p className="text-gray-600 text-justify mt-4">
                Sin embargo, esta política puede cambiar con el tiempo o ser actualizada, por lo que te recomendamos revisar esta página continuamente para asegurarte de estar de acuerdo con los términos.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-6">Información Recopilada</h2>
            <p className="text-gray-600 text-justify mt-2">
                Nuestro sitio web puede recoger información personal como nombre, información de contacto (correo electrónico, teléfono) e información demográfica. Además, cuando sea necesario, se podrá requerir información específica para procesar algún pedido o realizar una entrega o facturación.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-6">Uso de la Información</h2>
            <p className="text-gray-600 text-justify mt-2">
                Usamos la información recopilada para proporcionar el mejor servicio posible, incluyendo:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-4">
                <li>Mantener un registro de usuarios y pedidos.</li>
                <li>Mejorar nuestros productos y servicios.</li>
                <li>Enviar correos electrónicos con ofertas, nuevos productos y otra información publicitaria relevante.</li>
            </ul>
            <p className="text-gray-600 text-justify mt-4">
                Estos correos se enviarán a la dirección proporcionada por el usuario y podrán ser cancelados en cualquier momento.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-6">Seguridad</h2>
            <p className="text-gray-600 text-justify mt-2">
                Chameleon está comprometido con la seguridad de la información personal. Usamos sistemas avanzados y los actualizamos constantemente para evitar accesos no autorizados.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-6">Cookies</h2>
            <p className="text-gray-600 text-justify mt-2">
                Una cookie es un archivo que se envía para solicitar permiso de almacenamiento en tu ordenador. Este archivo permite analizar el tráfico web y facilitar futuras visitas a nuestro sitio. Las cookies no dan acceso a información de tu ordenador ni personal, a menos que lo autorices explícitamente.
            </p>

            <p className="text-gray-600 text-justify mt-4">
                Puedes aceptar o negar el uso de cookies. La mayoría de navegadores las aceptan automáticamente, pero puedes cambiar esta configuración. Sin embargo, al desactivarlas, algunos servicios podrían no estar disponibles.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-6">Enlaces a Terceros</h2>
            <p className="text-gray-600 text-justify mt-2">
                Este sitio web puede contener enlaces a otros sitios de interés. Una vez que accedas a estos enlaces y abandones nuestro sitio, no somos responsables de los términos o políticas de privacidad de dichos sitios terceros. Recomendamos revisar sus políticas de privacidad.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-6">Control de Información Personal</h2>
            <p className="text-gray-600 text-justify mt-2">
                En cualquier momento puedes restringir la recopilación o uso de tu información personal mediante las siguientes acciones:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-4">
                <li>Marcar o desmarcar la opción de recibir información por correo electrónico al llenar formularios en nuestro sitio web.</li>
                <li>Cancelar la suscripción a nuestros boletines en cualquier momento.</li>
            </ul>
            <p className="text-gray-600 text-justify mt-4">
                Chameleon no venderá, cederá ni distribuirá información personal sin tu consentimiento, salvo que sea requerido por una orden judicial.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-6">Cambios en la Política de Privacidad</h2>
            <p className="text-gray-600 text-justify mt-2">
                Chameleon se reserva el derecho de modificar esta política en cualquier momento. Te recomendamos revisar periódicamente esta página para estar al tanto de dichos cambios.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-6">Contacto</h2>
            <p className="text-gray-600 text-justify mt-2">
                Si tienes alguna duda sobre esta política, puedes contactarnos en:
            </p>
            <p className="text-gray-600 mt-4">
                <strong>Email:</strong> contacto@pañalesecologicos.com.co<br />
                <strong>Teléfono:</strong> +57 3202153327<br />
            </p>
        </div>
    );
};

export default PoliticasPrivacidad;
