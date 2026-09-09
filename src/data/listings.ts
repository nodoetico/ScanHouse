import { agencies } from './agencies';
import type { ListingExtras, ListingProperty } from '../types/listing';

const s = (
  type: string,
  distance: string,
  time: string,
  kind: ListingExtras['surrounding'][number]['kind'],
): ListingExtras['surrounding'][number] => ({ type, label: type, distance, time, kind });

const extras: ListingExtras[] = [
  {
    id: 'casa-laureles',
    operation: 'venta',
    propertyType: 'casa',
    landArea: 420,
    garages: 2,
    age: 'A estrenar',
    description:
      'Casa Laureles es una propiedad premium que combina arquitectura contemporánea con calidez residencial. Sus amplios espacios integrados, materiales nobles y distribución inteligente crean una experiencia de vida única en una de las zonas más cotizadas de San Salvador de Jujuy.',
    features: [
      'Jardín con sistema de riego automatizado',
      'Cocina integrada con isla y barra',
      'Living-comedor con doble altura',
      'Patio con deck de madera y parrilla',
      'Dormitorio principal en suite con vestidor',
      'Calefacción por losa radiante',
      'Aire acondicionado en todos los ambientes',
      'Domótica: iluminación, cortinas y seguridad',
      'DVH en todos los ventanales',
      'Piso de porcelanato y roble europeo',
    ],
    sceneIds: ['salon', 'cocina', 'pasillo', 'dormitorio-principal', 'dormitorio-2', 'bano', 'patio', 'cochera'],
    surrounding: [
      s('Supermercado', '250 m', '3 min caminando', 'comercio'),
      s('Farmacia', '180 m', '2 min caminando', 'salud'),
      s('Plaza', '400 m', '5 min caminando', 'verde'),
      s('Escuela', '650 m', '8 min caminando', 'educacion'),
      s('Hospital', '1,8 km', '6 min en vehículo', 'salud'),
      s('Parada de colectivo', '150 m', '2 min caminando', 'transporte'),
      s('Café boutique', '220 m', '3 min caminando', 'gastronomia'),
      s('Centro comercial', '1,2 km', '4 min en vehículo', 'comercio'),
    ],
    zoneQuality: { accessibility: 5, commerce: 5, transport: 4, services: 5, green: 4, connectivity: 4 },
    whyChooseZone: [
      'Supermercados y comercios a pocos minutos.',
      'Buena conexión con avenidas principales.',
      'Centros educativos cercanos.',
      'Espacios verdes en el entorno.',
      'Servicios esenciales accesibles caminando.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público cercano', ok: true },
      { label: 'Estacionamiento disponible', ok: true },
    ],
    zoneDescription:
      'Una zona residencial consolidada y tranquila, con comercios y servicios esenciales a pocos minutos, buena conectividad con el centro y espacios verdes cercanos.',
    compareTitles: ['Casa Puerto', 'Casona Los Gardens'],
  },
  {
    id: 'departamento-centro',
    operation: 'venta',
    propertyType: 'departamento',
    landArea: 0,
    garages: 1,
    age: '10 años',
    description:
      'Departamento luminoso en pleno casco céntrico de San Salvador de Jujuy. A pasos de bancos, comercios y transporte, con una distribución eficiente ideal para inversión o primera vivienda.',
    features: [
      'Vista abierta con balcón',
      'Expensas reducidas',
      'Cochería incluida',
      'Aire acondicionado frío/calor',
      'A metros del transporte',
      'Edificio con seguridad',
    ],
    sceneIds: ['salon', 'cocina', 'dormitorio-2', 'bano'],
    surrounding: [
      s('Banco', '120 m', '1 min caminando', 'servicio'),
      s('Supermercado', '300 m', '4 min caminando', 'comercio'),
      s('Farmacia', '200 m', '3 min caminando', 'salud'),
      s('Plaza', '500 m', '6 min caminando', 'verde'),
      s('Escuela', '400 m', '5 min caminando', 'educacion'),
      s('Parada de colectivo', '80 m', '1 min caminando', 'transporte'),
      s('Centro comercial', '350 m', '4 min caminando', 'comercio'),
      s('Clínica', '700 m', '9 min caminando', 'salud'),
    ],
    zoneQuality: { accessibility: 5, commerce: 5, transport: 5, services: 5, green: 3, connectivity: 5 },
    whyChooseZone: [
      'Todo a metros: bancos, comercios y transporte.',
      'Excelente conectividad en el centro.',
      'Servicios y clínicas a pocas cuadras.',
      'Ideal para inversión o renta.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público en la puerta', ok: true },
      { label: 'Estacionamiento disponible', ok: true },
    ],
    zoneDescription:
      'El corazón de la ciudad: la zona más conectada, con comercios, bancos y servicios a pasos, perfecta para quienes valoran la cercanía a todo.',
    compareTitles: ['Depto. Linda Vista', 'Departamento Gorriti'],
  },
  {
    id: 'casa-puerto',
    operation: 'venta',
    propertyType: 'casa',
    landArea: 520,
    garages: 3,
    age: '5 años',
    description:
      'Amplia casa en una zona residencial de alto valor de Palpalá. Cuatro dormitorios, tres baños y espacios generosos para toda la familia, con patio trasero, galería y cochera para tres vehículos.',
    features: [
      '4 dormitorios, 3 baños',
      'Galería y quincho',
      'Patio trasero con parrilla',
      'Cochera triple',
      'Economato y lavadero',
      'Pisos de porcelanato',
    ],
    sceneIds: ['salon', 'cocina', 'pasillo', 'dormitorio-principal', 'dormitorio-2', 'bano', 'patio', 'cochera'],
    surrounding: [
      s('Supermercado', '600 m', '7 min caminando', 'comercio'),
      s('Farmacia', '450 m', '5 min caminando', 'salud'),
      s('Plaza', '800 m', '10 min caminando', 'verde'),
      s('Escuela', '900 m', '11 min caminando', 'educacion'),
      s('Hospital', '2,1 km', '7 min en vehículo', 'salud'),
      s('Parada de colectivo', '200 m', '3 min caminando', 'transporte'),
      s('Club deportivo', '1 km', '3 min en vehículo', 'deporte'),
      s('Estación de servicio', '700 m', '2 min en vehículo', 'servicio'),
    ],
    zoneQuality: { accessibility: 5, commerce: 4, transport: 4, services: 5, green: 4, connectivity: 4 },
    whyChooseZone: [
      'Zona residencial tranquila y arbolada.',
      'Clubes y espacios deportivos cerca.',
      'Comercios y servicios a minutos.',
      'Rápido acceso a ruta y avenidas.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público cercano', ok: true },
      { label: 'Estacionamiento disponible', ok: true },
    ],
    zoneDescription:
      'Una zona residencial apacible de Palpalá, con calles arboladas, clubes deportivos cercanos y acceso directo a los accesos principales de la ciudad.',
    compareTitles: ['Casa Laureles', 'Casona Los Gardens'],
  },
  {
    id: 'loft-sierras',
    operation: 'venta',
    propertyType: 'loft',
    landArea: 0,
    garages: 0,
    age: '3 años',
    description:
      'Loft contemporáneo con vista a las sierras, de diseño diáfano e integrado. Un espacio versátil y luminoso pensado para quienes buscan diseño moderno y funcionalidad en un punto estratégico.',
    features: [
      'Planta diáfana de diseño',
      'Vista a las sierras',
      'Cocina integrada',
      'Espacio de trabajo',
      'Paraíso de interior',
      'Pisos de cemento alisado',
    ],
    sceneIds: ['salon', 'cocina', 'dormitorio-2', 'bano'],
    surrounding: [
      s('Supermercado', '1,1 km', '4 min en vehículo', 'comercio'),
      s('Farmacia', '900 m', '12 min caminando', 'salud'),
      s('Plaza', '600 m', '7 min caminando', 'verde'),
      s('Parada de colectivo', '400 m', '5 min caminando', 'transporte'),
      s('Café de autor', '850 m', '11 min caminando', 'gastronomia'),
      s('Senda peatonal', '350 m', '4 min caminando', 'verde'),
    ],
    zoneQuality: { accessibility: 5, commerce: 3, transport: 3, services: 4, green: 5, connectivity: 4 },
    whyChooseZone: [
      'Vistas y naturaleza a minutos.',
      'Ambiente tranquilo y moderno.',
      'Muy buena calidad de aire.',
      'Acceso directo para salir de la ciudad.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público cercano', ok: true },
      { label: 'Estacionamiento propio', ok: true },
    ],
    zoneDescription:
      'Un entorno serrano en ascenso, ideal para quienes buscan diseño, aire libre y tranquilidad sin alejarse demasiado de los servicios.',
    compareTitles: ['Departamento Centro', 'Loft Las Sierras'],
  },
  {
    id: 'terreno-altos',
    operation: 'venta',
    propertyType: 'terreno',
    landArea: 600,
    garages: 0,
    age: 'Lote',
    description:
      'Lote en Altos del Norte con vistas despejadas, listo para construir tu casa. Zona en desarrollo con acceso asfaltado, servicios disponibles y excelente potencial de valorización.',
    features: [
      '600 m² con frente de 20 m',
      'Servicios disponibles',
      'Vistas despejadas',
      'Zona en valorización',
      'Documentación en orden',
    ],
    sceneIds: ['patio', 'cochera'],
    surrounding: [
      s('Supermercado', '800 m', '2 min en vehículo', 'comercio'),
      s('Parada de colectivo', '500 m', '6 min caminando', 'transporte'),
      s('Escuela', '1 km', '3 min en vehículo', 'educacion'),
      s('Plaza', '1,2 km', '4 min en vehículo', 'verde'),
    ],
    zoneQuality: { accessibility: 4, commerce: 3, transport: 3, services: 4, green: 4, connectivity: 4 },
    whyChooseZone: [
      'Zona en pleno desarrollo.',
      'Gran potencial de valorización.',
      'Acceso asfaltado y servicios.',
      'Vistas despejadas al valle.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público cercano', ok: true },
    ],
    zoneDescription:
      'Una zona en crecimiento al norte de la ciudad, ideal para quienes buscan construir con vistas y proyección de valorización.',
    compareTitles: ['Casa Barrio Buenos Chicos'],
  },
  {
    id: 'casona-gardens',
    operation: 'venta',
    propertyType: 'casa',
    landArea: 800,
    garages: 3,
    age: '12 años',
    description:
      'Casona de estilo clásico en Los Gardens, San Pedro de Jujuy. Grandes ambientes, parque arbolado, quincho con parrilla y un frente cuidado que la convierten en una propiedad de carácter para toda la familia.',
    features: [
      'Parque arbolado de 800 m²',
      'Quincho con parrilla y horno',
      '3 dormitorios con placares',
      'Living con hogar a leña',
      'Cochera triple',
      'Habitación de servicio',
    ],
    sceneIds: ['salon', 'cocina', 'pasillo', 'dormitorio-principal', 'dormitorio-2', 'bano', 'patio', 'cochera'],
    surrounding: [
      s('Supermercado', '700 m', '9 min caminando', 'comercio'),
      s('Farmacia', '550 m', '7 min caminando', 'salud'),
      s('Plaza', '900 m', '11 min caminando', 'verde'),
      s('Escuela', '800 m', '10 min caminando', 'educacion'),
      s('Hospital', '1,5 km', '5 min en vehículo', 'salud'),
      s('Parada de colectivo', '300 m', '4 min caminando', 'transporte'),
      s('Club', '1,3 km', '4 min en vehículo', 'deporte'),
    ],
    zoneQuality: { accessibility: 5, commerce: 4, transport: 4, services: 5, green: 5, connectivity: 4 },
    whyChooseZone: [
      'Barrio consolidado de Los Gardens.',
      'Parque y espacios verdes propios.',
      'Colegios y clubes cercanos.',
      'Comercios de cercanía a minutos.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público cercano', ok: true },
      { label: 'Estacionamiento disponible', ok: true },
    ],
    zoneDescription:
      'Uno de los barrios más tradicionales de San Pedro de Jujuy, de casas bajas y calles arboladas, con colegios, clubes y comercios de cercanía.',
    compareTitles: ['Casa Puerto', 'Residencia El Parque'],
  },
  {
    id: 'duplex-mariano',
    operation: 'venta',
    propertyType: 'duplex',
    landArea: 150,
    garages: 1,
    age: '8 años',
    description:
      'Dúplex de dos plantas en Mariano Moreno, con amplio patio propio, galería y cochera. Una propuesta moderna y funcional con excelente relación espacios-precio.',
    features: [
      'Dos plantas con patio propio',
      'Galería y parrilla',
      'Cochera cubierta',
      '3 dormitorios',
      'Baño en suite',
      'Aire acondicionado',
    ],
    sceneIds: ['salon', 'cocina', 'pasillo', 'dormitorio-principal', 'bano'],
    surrounding: [
      s('Supermercado', '400 m', '5 min caminando', 'comercio'),
      s('Farmacia', '350 m', '4 min caminando', 'salud'),
      s('Plaza', '500 m', '6 min caminando', 'verde'),
      s('Escuela', '450 m', '6 min caminando', 'educacion'),
      s('Parada de colectivo', '250 m', '3 min caminando', 'transporte'),
      s('Centro comercial', '1 km', '3 min en vehículo', 'comercio'),
    ],
    zoneQuality: { accessibility: 5, commerce: 4, transport: 4, services: 5, green: 4, connectivity: 4 },
    whyChooseZone: [
      'Cercanía a colegios y plazas.',
      'Barrio familiar y seguro.',
      'Comercios a pocos minutos.',
      'Buena conexión con el centro.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público cercano', ok: true },
    ],
    zoneDescription:
      'Un barrio familiar de Mariano Moreno, bien conectado y con servicios de cercanía, ideal para quienes buscan espacios propios.',
    compareTitles: ['PH Villa Belgrano', 'Casa con Quincho'],
  },
  {
    id: 'linda-vista',
    operation: 'venta',
    propertyType: 'departamento',
    landArea: 0,
    garages: 1,
    age: '15 años',
    description:
      'Departamento con hermosa vista al valle en Barrio Los Nogales. Living amplio, balcón terraza, cochera y gastronomía en planta baja para los residentes del edificio.',
    features: [
      'Vista panorámica al valle',
      'Balcón terraza con quincho',
      '3 dormitorios',
      'Cochera y guardacoche',
      'Gastronomía compartida',
      'Edificio con seguridad',
    ],
    sceneIds: ['salon', 'cocina', 'dormitorio-principal', 'bano'],
    surrounding: [
      s('Supermercado', '500 m', '6 min caminando', 'comercio'),
      s('Farmacia', '400 m', '5 min caminando', 'salud'),
      s('Plaza', '700 m', '9 min caminando', 'verde'),
      s('Escuela', '650 m', '8 min caminando', 'educacion'),
      s('Clínica', '1 km', '3 min en vehículo', 'salud'),
      s('Parada de colectivo', '200 m', '3 min caminando', 'transporte'),
    ],
    zoneQuality: { accessibility: 4, commerce: 4, transport: 4, services: 5, green: 4, connectivity: 4 },
    whyChooseZone: [
      'Vistas privilegiadas y aire fresco.',
      'Barrio residencial de Los Nogales.',
      'Servicios cercanos.',
      'Ambiente tranquilo.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público cercano', ok: true },
    ],
    zoneDescription:
      'Barrio residencial en altura con vistas al valle, tranquilo y con servicios a la vuelta de la esquina.',
    compareTitles: ['Departamento Centro', 'Departamento Gorriti'],
  },
  {
    id: 'dpto-rivadavia',
    operation: 'alquiler',
    propertyType: 'departamento',
    landArea: 0,
    garages: 0,
    age: 'Consolidado',
    description:
      'Departamento en alquiler sobre Rivadavia, con excelente iluminación, dos dormitorios y ubicación estratégica a pasos del centro y el transporte.',
    features: [
      '2 dormitorios',
      'Excelente iluminación',
      'A metros del transporte',
      'Balcón',
      'Expensas accesibles',
      'Amueblado opcional',
    ],
    sceneIds: ['salon', 'cocina', 'dormitorio-2', 'bano'],
    surrounding: [
      s('Supermercado', '250 m', '3 min caminando', 'comercio'),
      s('Farmacia', '180 m', '2 min caminando', 'salud'),
      s('Banco', '350 m', '4 min caminando', 'servicio'),
      s('Plaza', '450 m', '6 min caminando', 'verde'),
      s('Parada de colectivo', '100 m', '1 min caminando', 'transporte'),
      s('Centro comercial', '500 m', '6 min caminando', 'comercio'),
    ],
    zoneQuality: { accessibility: 5, commerce: 5, transport: 5, services: 5, green: 3, connectivity: 5 },
    whyChooseZone: [
      'A pasos de todo: bancos, comercios y transporte.',
      'Máxima conectividad.',
      'Servicios a la vuelta.',
      'Ideal para alquiler con todo cerca.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Transporte público en la puerta', ok: true },
    ],
    zoneDescription:
      'Sobre avenida Rivadavia, una de las arterias más conectadas de la ciudad, con comercios y transporte en la puerta.',
    compareTitles: ['Departamento Centro', 'Departamento Gorriti'],
  },
  {
    id: 'residencia-el-parque',
    operation: 'venta',
    propertyType: 'casa',
    landArea: 460,
    garages: 2,
    age: '6 años',
    description:
      'Residencia construida con materiales premium frente a un parque lineal en Palpalá. Calles arboladas, plaza a la vuelta y espacios pensados para disfrutar en familia.',
    features: [
      'Frente al parque lineal',
      '3 dormitorios, 2 en suite',
      'Living con hogar',
      'Galería vidriada',
      'Patio con parrilla',
      'Cochera doble',
    ],
    sceneIds: ['salon', 'cocina', 'pasillo', 'dormitorio-principal', 'dormitorio-2', 'bano', 'patio', 'cochera'],
    surrounding: [
      s('Parque', '50 m', '1 min caminando', 'verde'),
      s('Supermercado', '450 m', '6 min caminando', 'comercio'),
      s('Farmacia', '400 m', '5 min caminando', 'salud'),
      s('Escuela', '550 m', '7 min caminando', 'educacion'),
      s('Hospital', '1,7 km', '5 min en vehículo', 'salud'),
      s('Parada de colectivo', '300 m', '4 min caminando', 'transporte'),
      s('Club', '900 m', '3 min en vehículo', 'deporte'),
    ],
    zoneQuality: { accessibility: 5, commerce: 4, transport: 4, services: 5, green: 5, connectivity: 4 },
    whyChooseZone: [
      'Frente a espacios verdes.',
      'Zona extra tranquila.',
      'Comercios y colegios cerca.',
      'Rápido acceso a avenidas.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público cercano', ok: true },
      { label: 'Estacionamiento disponible', ok: true },
    ],
    zoneDescription:
      'A un paso del parque lineal, una de las zonas más tranquilas y verdes de Palpalá.',
    compareTitles: ['Casa Puerto', 'Casona Los Gardens'],
  },
  {
    id: 'casa-quincho',
    operation: 'venta',
    propertyType: 'casa',
    landArea: 380,
    garages: 1,
    age: '4 años',
    description:
      'Casa moderna con gran quincho en Perico, ideal para reuniones. Patio amplio, galería, parrilla y tres dormitorios en un barrio familiar.',
    features: [
      'Quincho con parrilla',
      'Galería externa',
      '3 dormitorios',
      'Patio frontal y trasero',
      'Cochera cubierta',
      'Rejas perimetrales',
    ],
    sceneIds: ['salon', 'cocina', 'pasillo', 'dormitorio-principal', 'bano', 'patio'],
    surrounding: [
      s('Supermercado', '600 m', '8 min caminando', 'comercio'),
      s('Farmacia', '500 m', '6 min caminando', 'salud'),
      s('Plaza', '400 m', '5 min caminando', 'verde'),
      s('Escuela', '500 m', '6 min caminando', 'educacion'),
      s('Parada de colectivo', '250 m', '3 min caminando', 'transporte'),
      s('Estación de servicio', '800 m', '3 min en vehículo', 'servicio'),
    ],
    zoneQuality: { accessibility: 4, commerce: 4, transport: 4, services: 4, green: 4, connectivity: 4 },
    whyChooseZone: [
      'Barrio familiar de Perico.',
      'Plaza y colegios cerca.',
      'Gran quincho para recibir.',
      'Comercios a minutos.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público cercano', ok: true },
    ],
    zoneDescription:
      'Perico se consolida como una ciudad en crecimiento, con barrios familiares, servicios y una excelente conexión a la capital jujeña.',
    compareTitles: ['Dúplex Mariano Moreno', 'Casa Barrio Buenos Chicos'],
  },
  {
    id: 'depto-gorriti',
    operation: 'venta',
    propertyType: 'departamento',
    landArea: 0,
    garages: 1,
    age: '9 años',
    description:
      'Departamento de 2 dormitorios sobre calle Gorriti, luminoso y bien distribuido, con cochera y proximidad total a los amenities del centro.',
    features: [
      '2 dormitorios con placares',
      'Living comedor amplio',
      'Cochera cubierta',
      'Balcón a la calle',
      'Aire acondicionado',
      'Terma eléctrica',
    ],
    sceneIds: ['salon', 'cocina', 'dormitorio-2', 'bano'],
    surrounding: [
      s('Supermercado', '300 m', '4 min caminando', 'comercio'),
      s('Farmacia', '250 m', '3 min caminando', 'salud'),
      s('Banco', '400 m', '5 min caminando', 'servicio'),
      s('Plaza', '600 m', '8 min caminando', 'verde'),
      s('Clínica', '800 m', '10 min caminando', 'salud'),
      s('Parada de colectivo', '150 m', '2 min caminando', 'transporte'),
      s('Centro comercial', '450 m', '6 min caminando', 'comercio'),
    ],
    zoneQuality: { accessibility: 5, commerce: 5, transport: 5, services: 5, green: 3, connectivity: 5 },
    whyChooseZone: [
      'Centro y microcentro a pasos.',
      'Máxima oferta de servicios.',
      'Transporte abundante.',
      'Ideal como inversión.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Transporte público cercano', ok: true },
    ],
    zoneDescription:
      'En pleno corazón comercial de la ciudad, con todo el abanico de servicios a metros.',
    compareTitles: ['Departamento Centro', 'Depto. Linda Vista'],
  },
  {
    id: 'casa-buenos-chicos',
    operation: 'alquiler',
    propertyType: 'casa',
    landArea: 300,
    garages: 1,
    age: 'Consolidado',
    description:
      'Casa en alquiler en Barrio Buenos Chicos, con tres dormitorios, patio con parrilla y cochera. Una opción accesible y completa para alquilar en casa.',
    features: [
      '3 dormitorios',
      'Patio con parrilla',
      'Cochera cubierta',
      'Living comedor',
      'Cocina amoblada',
      'Rejas y portón',
    ],
    sceneIds: ['salon', 'cocina', 'pasillo', 'dormitorio-2', 'bano', 'patio'],
    surrounding: [
      s('Supermercado', '350 m', '4 min caminando', 'comercio'),
      s('Farmacia', '300 m', '4 min caminando', 'salud'),
      s('Plaza', '400 m', '5 min caminando', 'verde'),
      s('Escuela', '300 m', '4 min caminando', 'educacion'),
      s('Parada de colectivo', '200 m', '3 min caminando', 'transporte'),
      s('Club de barrio', '600 m', '8 min caminando', 'deporte'),
    ],
    zoneQuality: { accessibility: 4, commerce: 4, transport: 4, services: 4, green: 4, connectivity: 4 },
    whyChooseZone: [
      'Barrio consolidado y familiar.',
      'Colegio y plaza a pasos.',
      'Servicios comerciales cerca.',
      'Buena relación valor-zona.',
    ],
    access: [
      { label: 'Calle asfaltada', ok: true },
      { label: 'Alumbrado público', ok: true },
      { label: 'Veredas', ok: true },
      { label: 'Acceso vehicular', ok: true },
      { label: 'Transporte público cercano', ok: true },
    ],
    zoneDescription:
      'Barrio Buenos Chicos: una zona consolidada y familiar, con colegios, plazas y comercios de cercanía.',
    compareTitles: ['Casa con Quincho', 'PH Villa Belgrano'],
  },
];

const agencyBrandingFor = (name: string, logo: string, primary: string, secondary: string) => ({
  name,
  tagline: 'EXPERIENCIA DIGITAL INMOBILIARIA',
  logo,
  primaryColor: primary,
  secondaryColor: secondary,
});

export const allListings: ListingProperty[] = agencies
  .flatMap(a =>
    a.properties.map(p => ({
      p,
      a,
    })),
  )
  .filter(({ p }) => p.status === 'activa')
  .map(({ p, a }) => {
    const e = extras.find(x => x.id === p.id);
    if (!e) throw new Error(`Falta configuración pública para ${p.id}`);
    return {
      ...p,
      agencyId: a.id,
      agencyName: a.name,
      agencyLogo: a.logo,
      agencyBranding: agencyBrandingFor(
        a.name,
        a.logo,
        a.branding.primaryColor,
        a.branding.secondaryColor,
      ),
      images: e.sceneIds.map(sceneId => `/thumbnails/${sceneId}.jpg`),
      ...e,
      compareTitles: e.compareTitles ?? [],
    };
  });

export function getListing(id: string): ListingProperty | undefined {
  return allListings.find(l => l.id === id);
}

export function listingsForAgency(agencyId: string): ListingProperty[] {
  return allListings.filter(l => l.agencyId === agencyId);
}

export function similarToListing(listing: ListingProperty, n = 3): ListingProperty[] {
  return allListings
    .filter(l => l.id !== listing.id)
    .map(l => {
      const priceDiff = Math.abs(l.price - listing.price);
      const areaDiff = Math.abs(l.coveredArea - listing.coveredArea);
      const roomsDiff = Math.abs(l.bedrooms - listing.bedrooms);
      const typeBonus = l.propertyType === listing.propertyType ? 0 : 1;
      const score = priceDiff + areaDiff * 3 + roomsDiff * 25000 + typeBonus * 40000;
      return { l, score };
    })
    .sort((x, y) => x.score - y.score)
    .slice(0, n)
    .map(x => x.l);
}

export function formatPrice(listing: ListingProperty): string {
  const symbol = listing.currency === 'USD' ? 'USD ' : '$ ';
  return `${symbol}${listing.price.toLocaleString('es-AR')}`;
}

export const propertyTypeLabel: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  ph: 'PH',
  loft: 'Loft',
  terreno: 'Terreno',
  duplex: 'Dúplex',
};